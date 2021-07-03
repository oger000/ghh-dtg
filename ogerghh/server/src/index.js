/* eslint-disable no-console */
const logger = require('./lib/logger')
const app = require('./app')
const port = app.get('port')
const server = app.listen(port)

// force process.env.NODE_ENV to be set explicitly
if (!process.env.NODE_ENV) {
  logger.error('You must set the "NODE_ENV" environment variable explicitly. In production mode set "NODE_ENV=production".')
  process.exit(1)
}

process.on('unhandledRejection', (reason, promise) => {
  // logger.error('Unhandled Promise: ' + JSON.stringify(promise))
  throw new Error(`Unhandled Promise Rejection: ${reason}`)
})

server.on('listening', () => {
  const oldLogLevel = logger.level
  logger.level = 'info'
  logger.info(`Expres application started on http://${app.get('host')}:${port} in ${process.env.NODE_ENV} mode.`)
  logger.level = oldLogLevel
})
