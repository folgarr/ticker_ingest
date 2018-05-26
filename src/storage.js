import { InfluxDB, FieldType } from 'influx'
import { createClient } from 'redis'
import config from './config'

const redisClient = createClient({
  host: config.redis.host,
  port: config.redis.port,
})

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
      ],
    },
  ],
})

let pointsBatch = []

export function writeTickerEvent(timestamp, price, size, exchange, pair) {
  pointsBatch.push({
    measurement: INFLUX_TICKER_MEASUREMENT,
    fields: {
      price,
      size,
    },
    tags: {
      exchange,
      pair,
    },
    timestamp: new Date(timestamp),
  })

  // Useful for debugging purposes. Logs the tickers to the console as they come in.
  if (process.env.ECHO_TICKERS) {
    console.log(JSON.stringify(pointsBatch[pointsBatch.length - 1], null, 2))
  } else if (pointsBatch.length >= POINT_BATCH_SIZE_LIMIT) {
    console.log('Writing ', pointsBatch.length, ' points -- ', new Date())
    influx.writePoints(pointsBatch)
    pointsBatch = []
  }
}

export function rangeQuery({
  operation,
  field,
  timeRange,
  timeInterval,
}) {
  return influx.query(`
    SELECT ${operation}(${field}) FROM ticker
    WHERE time >= now() - ${timeRange}
    GROUP BY time(${timeInterval}), exchange, pair
  `)
}

/*
Each group corresponds to an exchange with currency pair.
A group contains a list of rows, where each row element covers a time interval:
[ ... ,
  {
    "time": "2018-05-18T00:00:00.000Z",
    "mean": 0.00002933646810293755,
    "exchange": "GDAX",
    "pair": "BTC/USD"
  }
, ... ]

Redis caching example for 1m time intervals within a 1h time range (from now)
Redis key: MEANPRICE_GDAX_BTC_USD_1h_1m
Redis value: a hash, mapping time intervals to mean price during that interval.
*/
export function rangeCacheWrite({
  operation,
  field,
  timeRange,
  timeInterval,
}, {
  rows,
  tags: {
    exchange,
    pair,
  },
}) {
  const [firstCurrency, secondCurrency] = pair.split('/')
  const op = `${operation.toUpperCase()}${field.toUpperCase()}`
  const key = [op, exchange, firstCurrency, secondCurrency, timeRange, timeInterval].join('_')
  const val = [rows[0].time.toISOString()].concat(rows.map(row => row[operation] || 'null'))
  // store list after DEL old list. multi/transaction avoids reader cache miss after DEL on key.
  const multi = redisClient.multi()
  multi.DEL(key)
  multi.rpush(key, val)
  multi.exec((err, replies) => {
    const now = new Date()
    if (err) {
      console.error(`${now} - Failed writing to Redis key ${key} -- error ${err}`)
    } else {
      console.log(`${now} - Successfull redis write - key: ${key} replies: ${replies}`)
    }
  })
}
