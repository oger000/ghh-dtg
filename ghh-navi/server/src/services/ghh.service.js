// Initializes the service
const express = require('express')
const router = express.Router()
const knex = require('../lib/knex')
const oger = require('../lib/ogerlib')
const UserFailure = oger.UserFailure
const { ogerWhere, ogerSelectModify } = require('../lib/ogerKnex')
const HttpStatus = require('http-status-codes')


// get list of gemeinden
router.post('/gemeinden', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex.raw('SELECT iid, gemeinde, gkz FROM kennsatz GROUP BY gkz ORDER BY gemeinde')
    return resp.send({ rows: rows })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get list of kennsätze for gemeinde
router.post('/gemeinde_jahre', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select(knex.raw('iid, finanzjahr, quartal, va_ra, nva, vrv, gkz'))
      .from('kennsatz')
      .where(vals)
      .orderByRaw('finanzjahr, va_ra desc, nva, vrv' )

    return resp.send({ rows: rows })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get list of bestandzeile for vrv
router.post('/vrv_bestandteile', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select(knex.raw('iid, name, dispname'))
      .from('vrv_bestandteile')
      .where(vals)
      .orderByRaw('reihung' )

    return resp.send({ rows: rows })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get gliederung of bestandteil
router.post('/bestandteil_gliederung', async (req, resp) => {
  try {
    const vals = req.body
    const bestandteil = vals.bestandteil
    let tableName = bestandteil

    switch (bestandteil) {
      case 'ergebnishaushalt':
        tableName = 'vrv_ehh'
        break

      case 'finanzierungshaushalt':
        tableName = 'vrv_fhh'
        break

      case 'vermoegenshaushalt':
        tableName = 'vrv_vhh'
        break

      default:
        const msg = `Unbekannter Bestandteil ${bestandteil}.`
        console.log(msg)
        return oger.sendError(resp, msg)
    }

    const rows = await knex
      .select()
      .from(tableName)
      .where({ vrv: vals.vrv })
      .orderByRaw('iid' )

    return resp.send({ rows: rows })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// export
module.exports = router
