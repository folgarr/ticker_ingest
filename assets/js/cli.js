#!/usr/bin/env node
var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ingest = require('./ingest');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_commander2['default'].command('ingest').description('Ingest tickers from websocket and save to InfluxDB.').action(() => (0, _ingest.ingest)());

_commander2['default'].command('aggregate').description('Aggregate ticker values into time intervals saved to Redis.').action(() => (0, _ingest.aggregate)());

_commander2['default'].on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', _commander2['default'].args.join(' '));
  process.exit(1);
});

_commander2['default'].parse(process.argv);
if (_commander2['default'].args.length === 0) {
  console.error('Invalid command -- Must provide argument and/or options as follows:');
  _commander2['default'].outputHelp();
}