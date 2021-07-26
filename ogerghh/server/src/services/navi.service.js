// Initializes the service
const express = require('express')
const router = express.Router()
const knex = require('../lib/knex')
const oger = require('../lib/ogerlib')
const UserFailure = oger.UserFailure
// const { ogerWhere, ogerSelectModify } = require('../lib/ogerKnex')
const HttpStatus = require('http-status-codes')
const logger = require('../lib/logger')


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
      .orderBy('reihung')

    return resp.send({ rows: rows })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of bestandteile


// get details for ergebnishaushalt
router.post('/ehh_details', async (req, resp) => {
  try {
    const data = await xhh_details(req, 'ergebnishaushalt', 'vrv_ehh', 'mvag_ehh')
    return resp.send({ rows: data.rows, total: data.total })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of ergebnishauhalt


// get details for finanzierungshaushalt
router.post('/fhh_details', async (req, resp) => {
  try {
    const data = await xhh_details(req, 'finanzierungshaushalt', 'vrv_fhh', 'mvag_fhh')
    return resp.send({ rows: data.rows, total: data.total })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of finanzierungshaushalt


// get details for vermoegenshaushalt
router.post('/vhh_details', async (req, resp) => {
  try {
    const data = await xhh_details(req, 'vermoegenshaushalt', 'vrv_vhh', 'mvag_vhh')
    return resp.send({ rows: data.rows, total: data.total })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of vermoegenshaushalt


// get details for ergebnishauhalt or finanzierungshaushalt
async function xhh_details(req, tableName, mvagTable, mvagField) {
  const vals = req.body

  const oriBaseFilter = Object.assign({}, vals.baseFilter)
  for (const key of Object.keys(vals.baseFilter)) {
    vals.baseFilter[`hh.${key}`] = vals.baseFilter[key]
    delete vals.baseFilter[key]
  }
  const where = knex.queryBuilder()
  where.where(vals.baseFilter)

  // conditional filters
  vals.filter = vals.filter || {}
  if (vals.filter.mvag) {
    where.andWhere(knex.raw(`${mvagField} LIKE '${vals.filter.mvag}%'`))
  }
  if (vals.filter.ansatz) {
    where.andWhere(knex.raw(`CONCAT(ansatz_uab, ansatz_ugl) LIKE '${vals.filter.ansatz}%'`))
  }
  if (vals.filter.konto) {
    where.andWhere(knex.raw(`CONCAT(konto_grp, ansatz_ugl) LIKE '${vals.filter.konto}%'`))
  }
  if (vals.filter.filterText) {
    where.andWhere(knex.raw(`( ansatz_text LIKE '%${vals.filter.filterText}%' OR konto_text LIKE '%${vals.filter.filterText}%' )`))
  }
  let query = where.clone()

  for (const sort of vals.sort || []) {
    query = query.orderBy(sort[0], sort[1])
  }

  // try {
    const rows = await query
      .select(knex.raw(`
        hh.iid, ` + (tableName === 'vermoegenshaushalt' ? 'endstand_vj, endstand_rj, id_vhh, ' : 'wert, wert_fj0,') +
        `CONCAT(ansatz_uab, ansatz_ugl, ' ', ansatz_text) AS ansatz_plus_text,
        CONCAT(konto_grp, konto_ugl, ' ', konto_text) AS konto_plus_text,

        CONCAT(ansatz1.ansatz, ' ', ansatz1.name) AS ansatz1_plus_text,
        CONCAT(ansatz2.ansatz, ' ', ansatz2.name) AS ansatz2_plus_text,
        CONCAT(ansatz3.ansatz, ' ', ansatz3.name) AS ansatz3_plus_text,

        CONCAT(konto1.konto, ' ', konto1.name) AS konto1_plus_text,
        CONCAT(konto2.konto, ' ', konto2.name) AS konto2_plus_text,
        CONCAT(konto3.konto, ' ', konto3.name) AS konto3_plus_text,

        CONCAT(mvag1.mvag, ' ', mvag1.name) AS mvag1_plus_text,
        CONCAT(mvag2.mvag, ' ', mvag2.name) AS mvag2_plus_text,

        finanzjahr, va_ra,
        ansatz_uab, ansatz_ugl, konto_grp, konto_ugl
      `))
      .from(`${tableName} AS hh`)
      .joinRaw(`
        LEFT OUTER JOIN vrv_ansaetze AS ansatz1 ON SUBSTRING(hh.ansatz_uab, 1, 1) = ansatz1.ansatz AND hh.vrv = ansatz1.vrv
        LEFT OUTER JOIN vrv_ansaetze AS ansatz2 ON SUBSTRING(hh.ansatz_uab, 1, 2) = ansatz2.ansatz AND hh.vrv = ansatz2.vrv
        LEFT OUTER JOIN vrv_ansaetze AS ansatz3 ON SUBSTRING(hh.ansatz_uab, 1, 3) = ansatz3.ansatz AND hh.vrv = ansatz3.vrv
        LEFT OUTER JOIN vrv_konten AS konto1 ON SUBSTRING(hh.konto_grp, 1, 1) = konto1.konto AND hh.vrv = konto1.vrv
        LEFT OUTER JOIN vrv_konten AS konto2 ON SUBSTRING(hh.konto_grp, 1, 2) = konto2.konto AND hh.vrv = konto2.vrv
        LEFT OUTER JOIN vrv_konten AS konto3 ON SUBSTRING(hh.konto_grp, 1, 3) = konto3.konto AND hh.vrv = konto3.vrv
        LEFT OUTER JOIN ${mvagTable} AS mvag1 ON SUBSTRING(hh.${mvagField}, 1, 3) = mvag1.mvag AND hh.vrv = mvag1.vrv
        LEFT OUTER JOIN ${mvagTable} AS mvag2 ON SUBSTRING(hh.${mvagField}, 1, 4) = mvag2.mvag AND hh.vrv = mvag2.vrv
      `)
      .limit(vals.limit)
      .offset(vals.offset)

    const total = await where
      .count('* AS total')
      .from(`${tableName} AS hh`)
      .then(rows => rows[0].total)

    for (const row of rows) {
      // row.wert = parseFloat(row.wert).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true })
      // row.wert_fj0 = parseFloat(row.wert_fj0).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true })

      const valueRows = await knex
        .select('*')
        .from(tableName)
        .where({
          ansatz_uab: row.ansatz_uab,
          ansatz_ugl: row.ansatz_ugl,
          konto_grp: row.konto_grp,
          konto_ugl: row.konto_ugl
        })
        .whereRaw('finanzjahr >= :finanzjahr_begin AND finanzjahr <= :finanzjahr_end', {
          finanzjahr_begin: oriBaseFilter.finanzjahr - 5,
          finanzjahr_end: oriBaseFilter.finanzjahr
        })

      const berichtArten = ['VA', 'RA']
      for (const vRow of valueRows) {
        if (berichtArten.indexOf(vRow.va_ra) === -1) {
          berichtArten.push(vRow.va_ra)
        }
      }

      // zuerst VA und dann RA
      // Voranschlagswerte aus RA überschreiben solche aus VA
      for (const berichtArt of berichtArten) {

        for (const vRow of valueRows) {

          if (vRow.va_ra != berichtArt) {
            continue
          }

          // extracheck for vhh
          if (tableName == 'vermoegenshaushalt' && vRow.id_vhh !== row.id_vhh) {
            continue
          }

          const toField = `wert_${ vRow.va_ra.toLowerCase() }_vj` + (row.finanzjahr - vRow.finanzjahr)
          let fromField = ''
          if (tableName === 'vermoegenshaushalt') {
            fromField = 'endstand_rj'
          }
          else if (vRow.va_ra === 'RA') {
            fromField = 'wert'
          }
          else {
            fromField = 'wert_fj0'
          }
          row[toField] = parseFloat(vRow[fromField]).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true })

          // check for duplicate origins
          if (row[toField + '_origin'] === vRow.va_ra) {
            const msg = `Mehrfache Herkunft für ${toField} in Bericht ${row[toField + '_origin']} : 1) ${row[toField + '_iid']} / 2 ${vRow.iid}) `
            logger.error(msg)
          }
          // remember orign and origin iid
          row[toField + '_origin'] = vRow.va_ra
          row[toField + '_iid'] = vRow.iid
        } // eo collect values for last years

        if (row.va_ra === 'RA') {
          row.wert1 = row.wert_ra_vj0
          row.wert2 = row.wert_va_vj0
          row.wert3 = (parseFloat(row.wert) - parseFloat(row.wert_fj0)).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true })
        }
        else if (row.va_ra === 'VA') {
          row.wert1 = row.wert_va_vj0
          row.wert2 = row.wert_va_vj1
          row.wert3 = row.wert_ra_vj2
        }
        else {
          throw new Error(`Unbekannte VA/RA Kennung '${row.va_ra}'.`)
        }

      } // eo va/ra loop
    } // eo post prep hh rows
  // } catch(err) {
  //   return err
  // }
  return { rows, total }
}  // eo list of ergebnishauhalt or finanzierungshaushalt details


// get details for vermoegenshaushalt
router.post('/vhh_details_OBSOLETE', async (req, resp) => {
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
      .limit(vals.limit)
      .offset(vals.offset)

    /*
    const rows = await query
      .raw('SELECT vermoegenshaushalt.*, vrv_vhh.name AS mvag_name FROM vermoegenshaushalt' +
        ' INNER JOIN vrv_vhh ON vrv_vhh.mvag=vermoegenshaushalt.mvag_vhh AND vrv_vhh.vrv=vermoegenshaushalt.vrv')
        .limit(vals.limit)
        .offset(vals.offset)
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
      .orderBy('iid')

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
      .orderBy('iid')

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
      .orderBy('iid')

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
      .orderBy('iid')

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
      .orderBy('iid')

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
