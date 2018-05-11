# CLI to ingest and/or aggregate crypto exchange ticker streams

## Getting started

To install this package and build the executable CLI `ticker-cli`:

```
npm install
npm run build
ticker-cli -h
```

*Note that this was tested using Node version 8.11.1*
## Ingest into InfluxDB

Collection is done by subscribing to channels on Coinigy's Websocket API.
When ticker data (price, exchange, pair, etc) is received from this websocket it is written into InfluxDB.

To begin this process:

```
ticker-cli ingest
```


## Aggregate InfluxDB ticker data points into Redis

Aggregation is done by querying InfluxDB over pre-defined time-ranges.
The results from these queries are aggregates that are saved into Redis.

To begin this process:

```
ticker-cli aggregate
```

From then on, APIs can simply query redis to obtain up-to-date historical cryptocurrency data :+1: 