const knex = require('knex')
const knexfile = require(__dirname + './../../config/knexfile')
const db = knex(knexfile)

module.exports = db
