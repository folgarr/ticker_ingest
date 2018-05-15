#!/usr/bin/env node
import cli from 'commander'
import config from './config'
import { ingestGdax, ingestBitfinex, aggregate } from './ingest'

const sources = Object.keys(config.ingestSources)

cli
  .command('ingest <sources...>')
  .description(`Ingest ticker data into InfluxDB. Sources to choose from: ${sources}.`)
  .action((chosenSources) => {
    const invalids = chosenSources.filter(e => !sources.includes(e))
    if (invalids.length > 0) {
      console.error(`Invalid sources provided: ${invalids}. Available sources are: ${sources}.`)
      process.exit(1)
    }

    if (chosenSources.includes('gdax')) {
      ingestGdax()
    }

    if (chosenSources.includes('bitfinex')) {
      ingestBitfinex()
    }
  })

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
