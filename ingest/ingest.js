const socketCluster = require('socketcluster-client');
const config = require('../config/config')
const Influx = require('influx');


const influx = new Influx.InfluxDB({
    host: config.influx.host,
    database: 'ticks',
    schema: [
      {
        measurement: 'price_ticks',
        fields: {
          price: Influx.FieldType.FLOAT,
        },
        tags: [
          'exchange',
          'pair'
        ]
      }
    ]
})


function ingest(exchangesInfo) {
    const socket = socketCluster.connect(config.coinigy.connectOptions);
    socket.on('connect', (status) => {
        socket.on('error', (err) => console.error(err));
        socket.emit("auth", config.coinigy.apiCredentials, (err, token) => {
            if (err) {
                console.error(err);
            } else if (token) {
                for (var ex in exchangesInfo) {
                    exchangesInfo[ex].forEach((pair) => consumeFromChannel(socket, ex, pair[0], pair[1]));
                }
            } else {
                console.error('Token not received after auth event!')
            }
        });   
    });
}

function consumeFromChannel(socket, exchange, currencyA, currencyB) {
    socket.subscribe(`TRADE-${exchange}--${currencyA}--${currencyB}`).watch(saveTickerEvent);
}

function saveTickerEvent(data) {
    //console.log(`${data['exchange']} ${data['label']} ${data['price']}`);
    console.log(data);
    influx.writePoints([
        {
            measurement: 'price_ticks',
            tags: {
                exchange: data['exchange'],
                pair: data['label']
            },
            fields: {
                price: data['price']
            },
            timestamp: new Date(data['timestamp'])
        }
    ]);
}

module.exports.ingest = ingest;
