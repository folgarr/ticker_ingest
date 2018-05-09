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


export default function ingest() {
  const socket = connect(config.coinigy.connectOptions)
  config.coinigy.channels.forEach((ch) => {
    socket.subscribe(ch, { waitForAuth: true, batch: true }).watch(saveTickerEvent)
  })

  socket.on('connect', (status) => {
    console.log('STATUS: ', status)
    socket.on('error', err => console.error(err))
    socket.emit('auth', config.coinigy.apiCredentials, (err, token) => {
      if (err) {
        console.error('ERROR WHILE AUTHENTICATING: ', err)
      } else if (token) {
        console.log('AUTHED SUCCESSFULLY!')
        console.log('NUMBER OF CHANNELS:', config.coinigy.channels.length)
      } else {
        console.error('Token not received after auth event!')
      }
    })
  })
}
