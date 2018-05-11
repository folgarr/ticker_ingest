#!/usr/bin/env node
import cli from 'commander'
import { ingest, aggregate } from './ingest'

cli
  .command('ingest')
  .description('Ingest tickers from websocket and save to InfluxDB.')
  .action(() => ingest())

cli
  .command('aggregate')
  .description('Aggregate ticker values into time intervals saved to Redis.')
  .action(() => aggregate())

cli.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', cli.args.join(' '))
  process.exit(1)
})

cli.parse(process.argv)
if (cli.args.length === 0) {
  console.error('Invalid command -- Must provide argument and/or options as follows:')
  cli.outputHelp()
}
