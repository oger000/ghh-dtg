// Initializes the service
const express = require('express')
const router = express.Router()
const knex = require('../lib/knex')
const oger = require('../lib/ogerlib')
const UserFailure = oger.UserFailure
const { ogerSelectModify } = require('../lib/ogerKnex')
const HttpStatus = require('http-status-codes')
const validate = require('../lib/validate.js')
const { requireSessionPerm } = require('./sessionPerm')

const tableName = 'task'
const validRule = require(`../validate/${tableName}.validate.js`)


// check perm for all routes
router.all('*', async (req, resp, next) => {
  try {
    requireSessionPerm(req, 'master')
  } catch(err) {
    return oger.sendError(resp, err)
  }
  next()
})


// get list of data rows
//router.get('/', async (req, resp) => {
router.post('/get-list', async (req, resp) => {
  try {
    const vals = req.body

    const where = knex.queryBuilder()
    vals.filter = vals.filter || {}
    if (vals.filter.searchName) {
      where.andWhere('name', 'like', `%${vals.filter.searchName}%`)
    }
    let query = where.clone()

    for (const sort of vals.sort || []) {
      query = query.orderBy(sort[0], sort[1])
    }

    const rows = await query
      .select(['id', 'name', 'begindate', 'enddate'])
      .from(tableName)
      .modify(qb => {
        ogerSelectModify(qb, {
          limit: vals.limit,
          offset: vals.offset
        })
      })

      const count = await where
        .count('* AS total')
        .from(tableName)
        .then(rows => rows[0].total)

    return resp.send({ rows: rows, count: count })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get single record
router.get('/:id', async (req, resp) => {
  try {
    const row = await knex
      .select('*')
      .from(tableName)
      .where({ id: req.params.id })
      .then(rows => rows[0])
    return resp.send(row)
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo get single record


// insert new record
router.post('/', async (req, resp) => {
  try {
    const vals = req.body
    delete vals.id  // remove serial (autoinc)
    const vErr = validate(vals, validRule.upsert)
    if (vErr) {
      throw new oger.ValidateFailure(vErr)
    }
    const ids = await knex.insert(vals).into(tableName).returning('id')
    return resp.send({ id: ids[0] })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo insert new record


// update redord
router.post('/:id', async (req, resp) => {
  try {
    const vals = req.body
    delete vals.id
    const vErr = validate(vals, validRule.upsert)
    if (vErr) {
      throw new oger.ValidateFailure(vErr)
    }
    await knex(tableName)
      .update(vals)
      .where({ id: req.params.id })

    return resp.sendStatus(HttpStatus.OK)
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo update record


// delete record
router.delete('/:id', async (req, resp) => {
  try {
    const id = req.params.id
    if (!+id) {  // paranoid check
      throw new UserFailure('Die ID des zu löschenden Eintrags fehlt.')
    }
    const deleteCount = await knex
      .del()
      .from(tableName)
      .where({ id: id })
    throw new UserFailure(`Es wurde ${JSON.stringify(deleteCount)} Eintrag gelöscht.`)
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo delete record


// init service
module.exports = router
