Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = ingest;

var _socketclusterClient = require('socketcluster-client');

var _influx = require('influx');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

const influx = new _influx.InfluxDB({
  host: _config2['default'].influx.host,
  username: _config2['default'].influx.username,
  password: _config2['default'].influx.password,
  database: 'ticks',
  schema: [{
    measurement: 'price_ticks',
    fields: {
      price: _influx.FieldType.FLOAT
    },
    tags: ['exchange', 'pair']
  }]
});

let pointsBatch = [];

function saveTickerEvent(data) {
  pointsBatch.push({
    measurement: 'price_ticks',
    tags: {
      exchange: data.exchange,
      pair: data.label
    },
    fields: {
      price: data.price
    },
    timestamp: new Date(data.timestamp)
  });

  if (pointsBatch.length >= 100) {
    console.log('Writing ', pointsBatch.length, ' points -- ', new Date());
    influx.writePoints(pointsBatch);
    pointsBatch = [];
  }
}

function ingest() {
  const socket = (0, _socketclusterClient.connect)(_config2['default'].coinigy.connectOptions);
  _config2['default'].coinigy.channels.forEach(ch => {
    socket.subscribe(ch, { waitForAuth: true, batch: true }).watch(saveTickerEvent);
  });

  socket.on('connect', status => {
    console.log('STATUS: ', status);
    socket.on('error', err => console.error(err));
    socket.emit('auth', _config2['default'].coinigy.apiCredentials, (err, token) => {
      if (err) {
        console.error('ERROR WHILE AUTHENTICATING: ', err);
      } else if (token) {
        console.log('AUTHED SUCCESSFULLY!');
        console.log('NUMBER OF CHANNELS:', _config2['default'].coinigy.channels.length);
      } else {
        console.error('Token not received after auth event!');
      }
    });
  });
}