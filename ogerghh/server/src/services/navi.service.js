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
    const rowsOut = []
    for (row of rows) {
      row.name = `${row.gemeinde} (${row.gkz})`
    }
    return resp.send({ rows: rows })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get list of kennsätze for gemeinde
router.post('/gemeinde_berichte', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select(knex.raw('iid, va_ra, finanzjahr, quartal, periode, va_ra, nva, vrv, gkz'))
      .from('kennsatz')
      .where(vals)
      .orderByRaw('finanzjahr, va_ra desc, nva, vrv' )

    for (row of rows) {
      let vaRa = ''
      switch (row.va_ra) {
        case 'VA':
          vaRa = 'Voranschlag'
          break
        case 'RA':
          vaRa = 'Rechnungsabschluss'
          break
        default:
          vaRa = `Unbekannt VA/RA='${row.va_ra}'.`
      }
      let name = `${vaRa} ${row.finanzjahr}`
      if (row.periode !== 'j') {
        name += '/' + row.periode.toUpperCase() + row.quartal
      }
      if (row.nva.toString() !== '0') {
        name += `/N${row.nva}`
      }
      row.name = `${name} (VRV ${row.vrv})`
    }
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
      .select(knex.raw('iid, name AS bestandteil, dispname AS name',))
      .from('vrv_bestandteile')
      .where(vals)
      .orderByRaw('reihung' )

    return resp.send({ rows: rows })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get details for ergebnishaushalt
router.post('/ehh_details', async (req, resp) => {
  const vals = req.body
  const tableName = 'ergebnishaushalt'

  const where = knex.queryBuilder()
  vals.filter = vals.filter || {}
  const filters = []
  if (vals.filter.searchName) {
    const searchName = `%${vals.filter.searchName}%`
    where.andWhere((qb) => {
      qb.where('firstname', 'like', searchName)
      qb.orWhere('lastname', 'like', searchName)
    })
  }
  let query = where.clone()

  for (const sort of vals.sort || []) {
    query = query.orderBy(sort[0], sort[1])
  }

  try {

    const rows = await query
      .select(knex.raw('*'))
      .from(tableName)
      .modify(qb => {
        ogerSelectModify(qb, {
          limit: vals.limit,
          offset: vals.offset
        })
      })

      const total = await where
        .count('* AS total')
        .from(tableName)
        .then(rows => rows[0].total)

    return resp.send({ rows: rows, total: total })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get ergebnishaushalt details
async function getErgebnishaushaltDetails(req) {

  const vals = req.body
  const tableName = 'vrv_ehh'

  //if (vals.)


  const rows = await knex
    .select()
    .from(tableName)
    .where({ vrv: vals.vrv })
    .orderByRaw('iid' )

  return rows
} // eo get ehh details

// export
module.exports = router
