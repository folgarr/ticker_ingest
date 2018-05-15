import { connect } from 'socketcluster-client'
import { InfluxDB, FieldType } from 'influx'
import { WebsocketClient } from 'gdax'
import BFX from 'bitfinex-api-node'
import config from './config'


const INFLUX_TICKER_MEASUREMENT = 'ticker'
const POINT_BATCH_SIZE_LIMIT = 50

const influx = new InfluxDB({
  host: config.influx.host,
  username: config.influx.username,
  password: config.influx.password,
  database: 'tickers',
  schema: [
    {
      measurement: INFLUX_TICKER_MEASUREMENT,
      fields: {
        price: FieldType.FLOAT,
        size: FieldType.FLOAT,
      },
      tags: [
        'exchange',
        'pair',
        'side',
      ],
    },
  ],
})

let pointsBatch = []

function saveTickerEvent(timestamp, price, size, side, exchange, pair) {
  pointsBatch.push({
    measurement: INFLUX_TICKER_MEASUREMENT,
    tags: {
      exchange,
      pair,
      side,
    },
    fields: {
      price,
      size,
    },
    timestamp: new Date(timestamp),
  })

  if (pointsBatch.length >= POINT_BATCH_SIZE_LIMIT) {
    console.log('Writing ', pointsBatch.length, ' points -- ', new Date())
    influx.writePoints(pointsBatch)
    pointsBatch = []
  }
}

export function ingestBitfinex() {
  console.log('Beginning ingestion of Bitfinex tickers via websocket API...')
  const bfx = new BFX({
    ws: {
      autoReconnect: true,
      seqAudit: true,
      packetWDDelay: 10 * 1000,
    },
  })

  const ws = bfx.ws(2)
  ws.on('error', err => console.error('BITFINEX API ERROR:', err))
  ws.on('open', () => {
    config.ingestSources.bitfinex.channels.forEach((ch) => {
      ws.subscribeTrades(ch)
      ws.onTrades({ pair: ch }, (trades) => {
        const [, timestamp, amount, price] = trades[0]
        saveTickerEvent(
          timestamp,
          price,
          Math.abs(amount),
          amount < 0 ? 'sell' : 'buy',
          'BITFINEX',
          `${ch.substring(0, 3)}/${ch.substring(3, 6)}`,
        )
      })
    })
  })

  ws.open()
}

export function ingestGdax() {
  console.log('Beginning ingestion of GDAX tickers via websocket API...')
  const gdaxClient = new WebsocketClient(
    config.ingestSources.gdax.channels,
    'wss://ws-feed.gdax.com',
    null,
    { channels: ['matches'] },
  )
  gdaxClient.on('message', (data) => {
    if (data.type === 'match') {
      saveTickerEvent(
        data.time,
        data.price,
        data.size,
        data.side,
        'GDAX',
        data.product_id.replace('-', '/'),
      )
    }
  })

  gdaxClient.on('error', (err) => {
    console.error('GDAX websocket error:')
    console.error(err)
  })

  gdaxClient.on('close', () => {
    console.log('Websocket closed! Attempting to reconnect every 30 seconds.')
    gdaxClient.connect()
    const reconnectInterval = setInterval(() => {
      if (gdaxClient.socket) {
        console.log('Successfuly reconnected! -- ', new Date())
        clearInterval(reconnectInterval)
      } else {
        console.log('Attempting to reconnect -- ', new Date())
        gdaxClient.connect()
      }
    }, 30000)
  })
}

// Unused for now until Coinigy increases channel limits...
export function ingest() {
  console.log('Starting Coinigy Websocket -> InfluxDB ingestion process.')
  const socket = connect(config.coinigy.connectOptions)
  config.coinigy.channels.forEach((ch) => {
    socket.subscribe(ch, { waitForAuth: true, batch: true }).watch(saveTickerEvent)
  })

  console.log('Connecting to Coinigy websocket...')
  socket.on('connect', (status) => {
    console.log('Connection Status:\n', status)
    socket.on('error', err => console.error(err))
    console.log('Attempting to auth to Coinigy...')
    socket.emit('auth', config.coinigy.apiCredentials, (err, token) => {
      if (err) {
        console.error('Error in authentication to coinigy:\n', err)
      } else if (token) {
        console.log('Successful authentication coinigy!')
        console.log('Number of channels to ingest from: ', config.coinigy.channels.length)
      } else {
        console.error('Token not received after auth event!')
      }
    })
  })
}

export function aggregate() {
  console.log('Starting aggregation caching into redis...')
  const ch = config.coinigy.channels[0]
  const [exc, currA, currB] = ch.slice(6).split('--')
  const qStr = `SELECT LAST(price) FROM price_ticks WHERE exchange = '${exc}' AND pair = '${currA}/${currB}'`
  influx.query(qStr).then((results) => {
    // results.groupRows.map(ele => ele.rows).forEach(row => console.log(row))
    console.log('GOT RESULTS!')
    console.log(results.groupRows)
  })
}
