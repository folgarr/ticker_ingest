#!/usr/bin/env node
var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ingest = require('./ingest');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_commander2['default'].command('ingest').description('Ingest tickers from websocket and save to InfluxDB.').action(() => console.log('RUN INGEST'));

_commander2['default'].command('aggregate').description('Aggregate ticker values into time intervals saved to Redis.').action(() => console.log('RUNNING AGG'));

_commander2['default'].parse(process.argv);