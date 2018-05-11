import { connect } from 'socketcluster-client'
import { InfluxDB, FieldType } from 'influx'
import config from './config'


const influx = new InfluxDB({
  host: config.influx.host,
  username: config.influx.username,
  password: config.influx.password,
  database: 'ticks',
  schema: [
    {
      measurement: 'price_ticks',
      fields: {
        price: FieldType.FLOAT,
      },
      tags: [
        'exchange',
        'pair',
      ],
    },
  ],
})

let pointsBatch = []

function saveTickerEvent(data) {
  pointsBatch.push({
    measurement: 'price_ticks',
    tags: {
      exchange: data.exchange,
      pair: data.label,
    },
    fields: {
      price: data.price,
    },
    timestamp: new Date(data.timestamp),
  })

  if (pointsBatch.length >= 100) {
    console.log('Writing ', pointsBatch.length, ' points -- ', new Date())
    influx.writePoints(pointsBatch)
    pointsBatch = []
  }
}


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
  // create redis connection
  // for each channel
  //    cache last price
  //    for every agg-range, cache points
  console.log('Starting caching of aggregation into redis...')
}
