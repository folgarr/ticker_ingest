# Ingest/Aggregate crypto tickers

*Tested for Node v8.11*

## Installing the CLI

From the project directory:

```
npm run build
npm install -g .
ticker-cli -h
```

## Environment variables

Provide the following as environment variables (or in `config.js`):

* `REDIS_HOST` (e.g. `localhost` or an AWS ElastiCache endpoint)
* `REDIS_PORT` (e.g. the default redis port `6379`)
* `INFLUX_HOST`
* `INFLUX_USERNAME`
* `INFLUX_PASSWORD`

**OPTIONAL:**

* `ECHO_TICKERS=1` to simply send received data to console instead of InfluxDB

## Ingest into InfluxDB

Collection is done by subscribing to channels on an exchange websocket API.
When ticker data (price, exchange, pair, etc) is received from this websocket it is written into InfluxDB.

To begin this process:

```
# to actually save the data to InfluxDB
ticker-cli ingest {gdax,bitfinex,binance}
```


## Aggregate InfluxDB ticker data points into Redis

Aggregation is done by querying InfluxDB over pre-defined time-ranges.
The results from these queries are aggregates that are saved into Redis.

To begin this process:

```
ticker-cli aggregate
```

Once the aggregations are in Redis, functions can simply query redis to serve up-to-date historical cryptocurrency data :+1: 