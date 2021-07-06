const express = require('express')
const router = express.Router()
const { sendError } = require('../lib/ogerlib')
const knex = require('../lib/knex')



// define the routes for services that need a valid authentification
router.use('/navi', require('./navi.service.js'))


module.exports = router
