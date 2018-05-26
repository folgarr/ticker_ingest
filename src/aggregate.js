import { rangeQuery, rangeCacheWrite } from './storage'

const AGGREGATIONS = [
  {
    operation: 'mean',
    field: 'price',
    timeRange: '1h',
    timeInterval: '1m',
  },
  {
    operation: 'mean',
    field: 'price',
    timeRange: '1d',
    timeInterval: '15m',
  },
  {
    operation: 'mean',
    field: 'price',
    timeRange: '1w',
    timeInterval: '1h',
  },
  {
    operation: 'mean',
    field: 'price',
    timeRange: '12w',
    timeInterval: '1d',
  },
]

export default function aggregate() {
  console.log(`Starting aggregation caching into redis at ${new Date()}...`)
  AGGREGATIONS.forEach((agg) => {
    rangeQuery(agg).then((res) => {
      res.groupRows.forEach((group) => {
        rangeCacheWrite(agg, group)
      })
    })
  })
}
