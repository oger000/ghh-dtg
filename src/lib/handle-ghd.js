
const db = require(__dirname + '/knex')

// "globals"
const xmlParts2015 = [
  'ergebnishaushalt',
  'er_sektor',
  'finanzierungshaushalt',
  'fr_sektor',
  'vermoegenshaushalt',
  'operating_leasing',
  'beteiligungen',
  'haftungen',
  'ppp_projekt',
  'personal',
  'pension',
  'oestp',
  'kultur',
  'vorhaben',
  'sonstige_daten'  // moved to kennsatz
]

const ghdWhereKeys = {}



// import xml data and prepare for database
async function importXml(config, data) {

  ghdWhereKeys.va_ra = config.va_ra
  ghdWhereKeys.nva = config.nva
  ghdWhereKeys.vrv = config.vrv
  ghdWhereKeys.gkz = data.kennsatz.gkz
  ghdWhereKeys.finanzjahr = data.kennsatz.finanzjahr
  ghdWhereKeys.quartal = data.kennsatz.quartal

  if (config.vrv == 2015) {
    await importXml2015(config, data)
  }
  else if (config.vrv == 1997) {
    console.log('Datenstruktur 1997 (XML) noch nicht implementiert.')
  }
  else {
    console.log(`Datenstruktur ${config.vrv} nicht vorgesehen.`)
  }
}  // eo import xml


// put xml data structure (vrv 2015 ghd xml 5.5) to database
async function importXml2015(config, data) {

  // prepare kennsatz und gesamt-ghd
  delete data.kennsatz.$  // specific to used xml library
  const kennsatz = Object.assign({}, data.kennsatz)
  for (const part of xmlParts2015) {
    delete kennsatz[part]
  }

  // cleanup global ghd object from kennsatz properties
  for (const prop in kennsatz) {
    delete data.kennsatz[prop]
  }


  let tableName = 'kennsatz'
  console.log(`Schreibe ${tableName}.`)
  await db(tableName).where(ghdWhereKeys).del()

  Object.assign(kennsatz, ghdWhereKeys)
  await db(tableName).insert(kennsatz)
  console.log('   Kennsatz geschrieben.')

  for (const part of xmlParts2015) {
    let partName = part.charAt(0).toUpperCase() + part.slice(1)
    console.log(`Schreibe Abschnitt ${partName}.`)
    let tableName = part
    await db(tableName).where(ghdWhereKeys).del()

    let partData = data.kennsatz[part]
    delete data.kennsatz[part]
    if (partData === null || partData == undefined) {
      console.log(`   Keine Daten für Abschnitt ${partName} vorhanden.`)
      continue
    }
    if (!Array.isArray(partData)) {
      partData = [ partData ]
    }

    // prep all records
    const records = []
    for (const rec of partData) {
      Object.assign(rec, ghdWhereKeys)
      if (part == 'beteiligungen' || part == 'haftungen') {
        rec.id = JSON.stringify(rec.id)
      }
      records.push(rec)
    }  // eo single rec

    await db(tableName).insert(records)
    console.log(`   ${records.length} Datensätze geschrieben.`)
  }  // eo part loop

  console.log('\n***Unbehandelte Daten:')
  console.log(JSON.stringify(data))

}  // eo import xml 2015



// import txt data and prepare for database
async function importTxt(config, data) {

  if (config.vrv == 1997) {
    await importTxt1997(config, data)
  }
  else if (config.vrv == 2015) {
    console.log('Datenstruktur 2015 (TXT) noch nicht implementiert.')
  }
  else {
    console.log(`Datenstruktur ${config.vrv} nicht vorgesehen.`)
  }
}  // eo import xml


// put txt data structure (vrv 1997 ghd xml 3.7) to database
async function importTxt1997(config, data) {

  ghdWhereKeys.va_ra = config.va_ra
  ghdWhereKeys.nva = config.nva
  ghdWhereKeys.vrv = config.vrv
  // ghdWhereKeys.gkz = data.kennsatz.gkz,
  // ghdWhereKeys.finanzjahr = data.kennsatz.finanzjahr,
  // ghdWhereKeys.quartal = data.kennsatz.quartal

  // unify eol
  lines = data.replace('\r', '\n').replace('\n\n', '\n').split('\n')
  console.log(`${lines.length} Zeilen eingelesen.`)

  const records = {}
  let lineNum = 0
  let memSatzart = ''
  for (line of lines) {

    lineNum++
    let tableName = ''
    let rec = {}

    if (line.trim() === '') {
      continue
    }

    rec.finanzjahr = line.substr(0, 4)
    rec.quartal = line.substr(4, 1)

    let monat = line.substr(5, 2)
    if (monat !== '00') {
      console.log(`*** ABBRUCH *** Datenträger enthält Monatsdaten in Zeile ${lineNum}. Diese können nicht verarbeitet werden.`)
      process.exit(1)
    }
    let id_art = line.substr(7, 3)
    rec.gkz = line.substr(10, 11).trim()

    let satzart = line.substr(21, 2)
    if (satzart !== memSatzart) {
      console.log(`Lese Satzart ${satzart}.`)
      memSatzart = satzart
    }
    switch (satzart) {
    case '01':
      tableName = 'kennsatz'
      ghdWhereKeys.gkz = rec.gkz
      ghdWhereKeys.finanzjahr = rec.finanzjahr
      ghdWhereKeys.quartal = rec.quartal

      if (rec.quartal === '0') {
        rec.periode = 'j'
      }
      else if ('1234'.indexOf(rec.quartal) > -1) {
        rec.periode = 'q'
      }
      else {
        console.log(`*** ABBRUCH *** Fehlerhafte Quartalsangabe '${rec.quartal}' in Zeile ${lineNum}.`)
        process.exit(1)
      }

      rec.gemeinde = line.substr(23, 80).trim()
      rec.verantwortlich = line.substr(103, 40).trim()
      rec.sachbearbeiter = line.substr(143, 40).trim()
      rec.telefon = line.substr(183, 20).trim()
      rec.email = line.substr(203, 80).trim()
      rec.version = line.substr(303, 8).trim()
      rec.edv = line.substr(283, 20).trim()
      rec.erstellt = line.substr(311, 8)
      rec.beschlossen = line.substr(319, 8)
      rec.beschlossen_fj0 = line.substr(327, 8)
      rec.beschlossen_fj1 = line.substr(335, 8)
      rec.beschlossen_mefp = line.substr(343, 8)
      // rec.beschlossen_fj0_nva = line.substr().trim()
      // rec.beschlossen_fj1_nva = line.substr().trim()
      // rec.beschlossen_mefp_nva = line.substr().trim()
      break

    case '02':
      tableName = 'finanzierungshaushalt'
      rec.hinweis = line.substr(23, 1)
      rec.ansatz_uab = line.substr(24, 3)
      rec.ansatz_ugl = line.substr(27, 3)
      rec.konto_grp = line.substr(30, 3)
      rec.konto_ugl = line.substr(33, 3)
      rec.sonst_ugl = line.substr(36, 3)
      rec.verguetung = line.substr(39, 1)
      // rec.vorhabencode = line.substr()
      // rec.mvag_fhh = line.substr()

      rec.ansatz_text = line.substr(110, 80)
      rec.konto_text = line.substr(190, 80)
      rec.wert = parseInt(line.substr(82, 14)) / 100
      // rec.wert_fj0 = line.substr()
      // rec.wert_fj1 = line.substr()
      // rec.wert_fj2 = line.substr()
      // rec.wert_fj3 = line.substr()
      // rec.wert_fj4 = line.substr()
      // rec.wert_fj5 = line.substr()
      break

    case '03':
    case '04':
    case '05':
    case '06':
    case '07':
    case '08':
    case '09':
    case '91':
      tableName = 'dummy'
      break
    default:
      console.log(`Unbekannte Satzart ${satzart}.`)
      continue
    }  // eo satzart

    Object.assign(rec, ghdWhereKeys)
    if (!records[tableName]) {
      records[tableName] = []
    }
    records[tableName].push(rec)
  }  // eo text line loop

  // write to db
  for (tableName of Object.keys(records)) {
    if (tableName === 'dummy') {
      continue
    }
    await db(tableName).where(ghdWhereKeys).del()
    await db(tableName).insert(records[tableName])
    console.log(`${tableName}: ${records[tableName].length} Datensätze geschrieben.`)
  }  // eo write part loop

}  // eo import txt 1997


// do the exports
module.exports = {
  importXml,
  importTxt
}
