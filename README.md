# Ingest/Aggregate crypto tickers

## Installing the CLI

From the project directory:

```
npm run build
npm install -g .
ticker-cli -h
```

*Note that this was tested using Node version 8.11.1*
## Ingest into InfluxDB

Collection is done by subscribing to channels on an exchange websocket API.
When ticker data (price, exchange, pair, etc) is received from this websocket it is written into InfluxDB.

To begin this process:

```
# to only view the incoming websocket data
ECHO_TICKERS=1 ticker-cli ingest {gdax,bitfinex,binance}
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