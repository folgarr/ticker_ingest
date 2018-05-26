import BFX from 'bitfinex-api-node'
import Binance from 'binance-api-node'
import { connect } from 'socketcluster-client'
import { WebsocketClient } from 'gdax'
import { writeTickerEvent } from './storage'
import config from './config'


export function ingestBinance() {
  console.log('Beginning ingestion of Binance tickers via websocket API...')
  const client = Binance()
  client.ws.trades(config.ingestSources.binance.channels, (trade) => {
    writeTickerEvent(
      trade.eventTime,
      trade.price,
      trade.quantity,
      'BINANCE',
      `${trade.symbol.substring(0, 3)}/${trade.symbol.substring(3)}`,
    )
  })
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
        writeTickerEvent(
          timestamp,
          price,
          Math.abs(amount),
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
      writeTickerEvent(
        data.time,
        data.price,
        data.size,
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
    socket.subscribe(ch, { waitForAuth: true, batch: true }).watch(writeTickerEvent)
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
