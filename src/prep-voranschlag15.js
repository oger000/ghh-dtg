/*
 * Voranschlag einspielen
*/

const fs = require('fs')
const csv = require('csvtojson')
const xml2js = require('xml2js')
const knex = require('knex')
const knexfile = require(__dirname + '/../config/knexfile')
const db = knex(knexfile)

// config ****************************************++
const hhIdFields = [ 'va_ra', 'gkz', 'finanzjahr', 'quartal' ]
const hhVaRa = 'VA'

// ****************************************************+++
const hhIdWhere = {}

const csvIn = csv({
  delimiter: ';',
  trim: true,
  ignoreEmpty: false  // false is default
})

const xParser = new xml2js.Parser({
  trim: true,
  explicitArray: false
})


const dataDir = __dirname + '/../data-localonly/'
const inputFile = dataDir + '2021-1Voranschlag-format.xml'
if(fs.existsSync(inputFile)) {
  console.log('Lese Daten von: ' + inputFile)
}
else {
  console.log(inputFile + ' nicht gefunden.')
  process.exit()
}

// haupt app (separate funktion wegen await/async)
main()
.then(() => {
    console.log('*** ENDE THEN ***')
    process.exit()
  }
)
.catch((err) => {
  console.log(err)
  process.exit()
})


// main app
async function main() {

  if (inputFile.endsWith('.xml')) {
    await readXml()
  }
  else {
    await readCsv()
  }

}  // eo main



// read xml data
async function readXml() {

  const xmlContent = fs.readFileSync(inputFile ).toString()
  const hhObj = await xParser.parseStringPromise(xmlContent)
  hhObj.kennsatz.va_ra = hhVaRa
  //console.log(hhObj); process.exit()

  copyProps(hhObj.kennsatz, hhIdFields, hhIdWhere)

  await xmlKennsatz2db(hhObj)

  const hhParts = [
    // 'ergebnishaushalt',
    // 'finanzierungshaushalt',
    // 'vermoegenshaushalt',
    // 'beteiligungen',
    // 'haftungen',
    // 'personal',
    'vorhaben'
  ]

  for (hhPart of hhParts) {
    if (!hhPart) { continue }
    await xmlXhh2db(hhObj, hhPart)
  }
}  // eo read xml


// write kennsatz to db
async function xmlKennsatz2db(hhObj) {

  const kennsatz = copyProps(hhObj.kennsatz, [ 'va_ra', 'gkz', 'gemeinde', 'finanzjahr', 'quartal', 'periode',
    'verantwortlich', 'sachbearbeiter', 'telefon', 'email', 'version', 'edv', 'erstellt', 'beschlossen_fj0' ])
  Object.assign(kennsatz, hhObj.kennsatz.sonstige_daten)

  const tableName = 'kennsatz'
  await db(tableName).where(hhIdWhere).del()
  await db(tableName).insert(kennsatz)
  console.log('Kennsatz geschrieben.')
}  // eo xml kennsatz


// write ergebnishaushalt und finanzierungshaushalt to db
async function xmlXhh2db(hhObj, hhPart) {

  const limit = 0  // > 0 = debug x recs

  const recOutAll = []
  hhPartRecs = hhObj.kennsatz[hhPart]
  if (!Array.isArray(hhPartRecs)) {
    hhPartRecs = [ hhPartRecs ]
  }

  // loop over recs
  let i = 0
  for (const rec of hhPartRecs) {

    // convert YYYYMM to YYYY-MM
    if (hhPart == 'vermoegenshaushalt' || hhPart == 'haftungen' || hhPart == 'vorhaben') {
      rec.laufzeit_von = prepShortDate(rec.laufzeit_von)
      rec.laufzeit_bis = prepShortDate(rec.laufzeit_bis)
    }

    // ugly hack for unknown id property
    if (hhPart == 'beteiligungen') {
      rec.id_fbn = rec.id
      if (rec.id.fbn) {
        rec.id_fbn = rec.id.fbn
      }
      delete rec.id
    }

    // ugly hack for unknown id property
    if (hhPart == 'haftungen') {
      rec.id_uid = rec.id
      if (rec.id.uid) {
        rec.id_uid = rec.id.uid
      }
      delete rec.id
    }

    //console.log(rec)
    // add where ids
    Object.assign(rec, hhIdWhere)
    recOutAll.push(rec)

    if (limit) {
      if (i++ > limit) {
        break
      }
      console.log(rec)
    }
  }

  const tableName = hhPart
  await db(tableName).where(hhIdWhere).del()
  await db.batchInsert(tableName, recOutAll)
  console.log(hhPart.substr(0, 1).toUpperCase() + hhPart.substr(1) + ': ' + recOutAll.length + ' Datensätze geschrieben.')
}  // eo ehh/fhh




// read csv data
async function readCsv() {

  console.log('CSV not implemented.')
  process.exit()

  let recOutAll = []
  const recInAll = await csvIn.fromFile(inputFile)
  for (let i = 0; i < recInAll.length; i++) {
    let recIn = recInAll[i]
    /*
    if (i > 10) {
      break
    }
    */

    if (recIn.A === 'A') {
      continue
    }
    if (recIn.A.startsWith('Gruppe')) {
      recIn.Bezeichnung = recIn.A.substr(11).replace(/ \(.*$/, '').trim()
      recIn.A = recIn.A.substr(7,1)
    }

    let grpNum = recIn.A || recIn.U
    let name = recIn.Bezeichnung
    let recOut = {
      vrv: '2015',
      grpnum: grpNum,
      name: name
    }

    // console.log('' + i + ' ' + recOut.grpnum + '=' + recOut.name)
    recOutAll.push(recOut)
  }
  console.log('Begin: Write ' + recOutAll.length + ' records to db.')
  const tableName = 'ansatzgruppe'
  await db(tableName).truncate()
  await db.batchInsert(tableName, recOutAll)
  console.log('End: Write to db.')
}  // eo read csv



// copy selected obj properties (only for plain values, NOT FOR DEEP COPY)
function copyProps(fromObj, props, toObj) {

  if (!toObj) {
    toObj = {}
  }

  for (const prop of props) {
    toObj[prop] = fromObj[prop]
  }
  return toObj
}  // eo copy props


// prep short date YYYYMM
function prepShortDate(val) {

  if (val === '000000') {
    val = ''
  }
  if (val && val.length == 6) {
    val = val.substr(0,4) + "-" + val.substr(4)
  }
  return val
}  // eo prep short date
