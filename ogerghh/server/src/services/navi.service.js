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
      .orderByRaw('finanzjahr, va_ra desc, nva, vrv')

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
})  // eo list of kennsätze


// get list of bestandzeile for vrv
router.post('/vrv_bestandteile', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select(knex.raw('iid, name AS bestandteil, dispname AS name',))
      .from('vrv_bestandteile')
      .where(vals)
      .orderByRaw('reihung')

    return resp.send({ rows: rows })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of bestandteile


// get details for ergebnishaushalt
router.post('/ehh_details', async (req, resp) => {
  const vals = req.body
  const tableName = 'ergebnishaushalt'

  const where = knex.queryBuilder()
  where.where(vals.baseFilter)

  // conditional filters
  vals.filter = vals.filter || {}
  if (vals.filter.mvag) {
    where.andWhere(knex.raw(`mvag_ehh LIKE '${vals.filter.mvag}%'`))
  }
  if (vals.filter.ansatz) {
    where.andWhere(knex.raw(`CONCAT(ansatz_uab, ansatz_ugl) LIKE '${vals.filter.ansatz}%'`))
  }
  if (vals.filter.konto) {
    where.andWhere(knex.raw(`CONCAT(konto_grp, ansatz_ugl) LIKE '${vals.filter.konto}%'`))
  }
  let query = where.clone()

  for (const sort of vals.sort || []) {
    query = query.orderBy(sort[0], sort[1])
  }

  try {
    const rows = await query
      .select('*')
      .from(tableName)
      .modify(qb => {
        ogerSelectModify(qb, {
          limit: vals.limit,
          offset: vals.offset
        })
      })

    for (row of rows) {
      row.ansatz_text = `${row.ansatz_uab}${row.ansatz_ugl} ${row.ansatz_text}`
      row.konto_text = `${row.konto_grp}${row.konto_ugl} ${row.konto_text}`
    }

    const total = await where
      .count('* AS total')
      .from(tableName)
      .then(rows => rows[0].total)

    return resp.send({ rows: rows, total: total })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of ergebnishauhalt


// get details for finanzierungshaushalt
router.post('/fhh_details', async (req, resp) => {
  const vals = req.body
  const tableName = 'finanzierungshaushalt'

  const where = knex.queryBuilder()
  where.where(vals.baseFilter)

  // conditional filters
  vals.filter = vals.filter || {}
  if (vals.filter.mvag) {
    where.andWhere(knex.raw(`mvag_fhh LIKE '${vals.filter.mvag}%'`))
  }
  if (vals.filter.ansatz) {
    where.andWhere(knex.raw(`CONCAT(ansatz_uab, ansatz_ugl) LIKE '${vals.filter.ansatz}%'`))
  }
  if (vals.filter.konto) {
    where.andWhere(knex.raw(`CONCAT(konto_grp, ansatz_ugl) LIKE '${vals.filter.konto}%'`))
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

    for (row of rows) {
      row.ansatz_text = `${row.ansatz_uab}${row.ansatz_ugl} ${row.ansatz_text}`
      row.konto_text = `${row.konto_grp}${row.konto_ugl} ${row.konto_text}`
    }

    const total = await where
      .count('* AS total')
      .from(tableName)
      .then(rows => rows[0].total)

    return resp.send({ rows: rows, total: total })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of finanzierungshaushalt


// get details for vermögenshaushalt
router.post('/vhh_details', async (req, resp) => {
  const vals = req.body
  const tableName = 'vermoegenshaushalt'

  const where = knex.queryBuilder()
  // where.where(vals.baseFilter)
  for (const key of Object.keys(vals.baseFilter)) {
    where.andWhere(`vermoegenshaushalt.${key}`, vals.baseFilter[key])
  }

  // conditional filters
  vals.filter = vals.filter || {}
  if (vals.filter.mvag) {
    where.andWhere(knex.raw(`mvag_vhh LIKE '${vals.filter.mvag}%'`))
  }
  if (vals.filter.ansatz) {
    where.andWhere(knex.raw(`CONCAT(ansatz_uab, ansatz_ugl) LIKE '${vals.filter.ansatz}%'`))
  }
  if (vals.filter.konto) {
    where.andWhere(knex.raw(`CONCAT(konto_grp, ansatz_ugl) LIKE '${vals.filter.konto}%'`))
  }
  let query = where.clone()

  for (const sort of vals.sort || []) {
    query = query.orderBy(sort[0], sort[1])
  }

  try {
    const rows = await query
      .select(knex.raw('vermoegenshaushalt.*, vrv_vhh.name AS mvag_name'))
      .from(tableName)
      // .innerJoin('vrv_vhh', 'vermoegenshaushalt.mvag_vhh', 'vrv_vhh.mvag').andOn('vermoegenshaushalt.vrv', '=', 'vrv_vhh.vrv')
      .joinRaw('INNER JOIN vrv_vhh ON vrv_vhh.mvag=vermoegenshaushalt.mvag_vhh AND vrv_vhh.vrv=vermoegenshaushalt.vrv')
      .modify(qb => {
        ogerSelectModify(qb, {
          limit: vals.limit,
          offset: vals.offset
        })
      })
    /*
    const rows = await query
      .raw('SELECT vermoegenshaushalt.*, vrv_vhh.name AS mvag_name FROM vermoegenshaushalt' +
        ' INNER JOIN vrv_vhh ON vrv_vhh.mvag=vermoegenshaushalt.mvag_vhh AND vrv_vhh.vrv=vermoegenshaushalt.vrv')
      .modify(qb => {
        ogerSelectModify(qb, {
          limit: vals.limit,
          offset: vals.offset
        })
      })
      */

    for (row of rows) {
      // row.mvag_text = `${row.mvag_vhh} ${row.mvag_name}`
      row.mvag_text = row.mvag_vhh
      row.ansatz_text = `${row.ansatz_uab}${row.ansatz_ugl} ${row.ansatz_text}`
      row.konto_text = `${row.konto_grp}${row.konto_ugl} ${row.konto_text}`
    }

    const total = await where
      .count('* AS total')
      .from(tableName)
      .then(rows => rows[0].total)

    return resp.send({ rows: rows, total: total })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get list of ansätze
router.post('/select_ansatz', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select('*')
      .from('vrv_ansaetze')
      // .where(vals)
      .orderByRaw('iid')

    const rowsOut = []
    for (row of rows) {
      const label = `${row.ansatz} ${row.name}` // .replaceAll(' ', '&nbsp;')
      rowsOut.push({ label: label, value: row.ansatz})
    }
    return resp.send({ rows: rowsOut })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of ansätze


// get list of konten
router.post('/select_konto', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select('*')
      .from('vrv_konten')
      // .where(vals)
      .orderByRaw('iid')

    const rowsOut = []
    for (row of rows) {
      const label = `${row.konto} ${row.name}` // .replaceAll(' ', '&nbsp;')
      rowsOut.push({ label: label, value: row.konto})
    }
    return resp.send({ rows: rowsOut })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of konten


// get list of mvag vhh
router.post('/select_mvag_vhh', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select('*')
      .from('vrv_vhh')
      .where(vals)
      .orderByRaw('iid')

    const rowsOut = []
    for (row of rows) {
      const label = `${row.mvag} ${row.name}` // .replaceAll(' ', '&nbsp;')
      rowsOut.push({ label: label, value: row.mvag})
    }
    return resp.send({ rows: rowsOut })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of mvag vhh


// get list of mvag ehh
router.post('/select_mvag_ehh', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select('*')
      .from('vrv_ehh')
      .where(vals)
      .orderByRaw('iid')

    const rowsOut = []
    for (row of rows) {
      const label = `${row.mvag} ${row.name}` // .replaceAll(' ', '&nbsp;')
      rowsOut.push({ label: label, value: row.mvag})
    }
    return resp.send({ rows: rowsOut })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of mvag ehh


// get list of mvag fhh
router.post('/select_mvag_fhh', async (req, resp) => {
  try {
    const vals = req.body
    const rows = await knex
      .select('*')
      .from('vrv_fhh')
      .where(vals)
      .orderByRaw('iid')

    const rowsOut = []
    for (row of rows) {
      const label = `${row.mvag} ${row.name}` // .replaceAll(' ', '&nbsp;')
      rowsOut.push({ label: label, value: row.mvag})
    }
    return resp.send({ rows: rowsOut })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of mvag fhh



// export
module.exports = router
