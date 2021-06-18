/* eslint-disable no-console */
const app = require('./src/app')

// force process.env.NODE_ENV to be set explicitly
/*
if (!process.env.NODE_ENV) {
  logger.error('You must set the "NODE_ENV" environment variable explicitly. In production mode set "NODE_ENV=production".')
  process.exit(1)
}
*/

process.on('unhandledRejection', (reason, promise) => {
  // logger.error('Unhandled Promise: ' + JSON.stringify(promise))
  throw new Error(`Unhandled Promise Rejection: ${reason}`)
})
