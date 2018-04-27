const ingest = require('./ingest/ingest')
const config = require('./config/config')
ingest.ingest(config.exchanges)
