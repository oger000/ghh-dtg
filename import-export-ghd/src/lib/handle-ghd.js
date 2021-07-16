const db = require(__dirname + '/knex')
const json2csv = require('json2csv')
const path = require('path')
const XLSX = require('xlsx')


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
      tableName = 'finanzierungshaushalt'  // und ev ergebnishaushalt
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
      if (config.va_ra === 'VA') {
        // voranschlagswerte sind auch im RA enthalten, werden dort aber ignoriert
        // ansonsten müsste man einen zusätzlichen VA (NVA 99 ???)mit diesen werten erstellen
        rec.wert = parseInt(line.substr(82, 14)) / 100  // Gesamt-Voranschlag Rechnungsjahr
      }
      else if (config.va_ra === 'RA') {
        rec.wert = parseInt(line.substr(68, 14)) / 100  // FIN-HH Ist Rechnungsjahr (-quartal/-monat)
        // jahres-soll wird ignoriert, weil wir den ergebnishaushalt für vrv1997 nicht verwenden
        // rec.wert = parseInt(line.substr(54, 14)) / 100  // ERG-HH soll Rechnungsjahr (-quartal/-monat)
      }

      // rec.wert_fj0 = line.substr()
      // rec.wert_fj1 = line.substr()
      // rec.wert_fj2 = line.substr()
      // rec.wert_fj3 = line.substr()
      // rec.wert_fj4 = line.substr()
      // rec.wert_fj5 = line.substr()
      break

    case '03':   // schulden
      tableName = 'vermoegenshaushalt'
      rec.ansatz_uab= line.substr(38, 3)
      rec.ansatz_ugl= line.substr(41, 3)
      // rec.konto_grp= line.substr()
      // rec.konto_ugl= line.substr()
      // rec.sonst_ugl= line.substr()
      // rec.vorhabencode= line.substr()
      rec.id_vhh= line.substr(23, 15).trim()
      // rec.sektor= line.substr()
      rec.land= line.substr(47, 2)

      // rec.mvag_vhh= line.substr()
      // rec.ansatz_text= line.substr()
      rec.konto_text= line.substr(216, 80)
      rec.endstand_vj= parseInt(line.substr(66, 14)) / 100
      rec.zugang= parseInt(line.substr(80, 14)) / 100
      rec.abgang= parseInt(line.substr(94, 14)) / 100
      rec.aenderung= parseInt(line.substr(108, 14)) / 100
      rec.endstand_rj= parseInt(line.substr(122, 14)) / 100

      // rec.abschreibung= line.substr()
      // rec.umbuchung= line.substr()
      rec.hoehe= parseInt(line.substr(164, 14)) / 100
      rec.ersaetze= parseInt(line.substr(150, 14)) / 100
      rec.zinsen= parseInt(line.substr(136, 14)) / 100
      rec.verzinsungsart= line.substr(215, 1)
      rec.waehrung= line.substr(51, 3)
      rec.laufzeit_von= line.substr(178, 6)
      rec.laufzeit_bis= line.substr(184, 6)
      // rec.fbn= line.substr()
      rec.isin= line.substr(54, 12)
      // rec.notleidend= line.substr()
      // rec.minleasing= line.substr()
      // rec.nachweis= line.substr()
      // rec.wechselkurs_zug= line.substr()
      // rec.wechselkurs_vj= line.substr()
      // rec.wechselkurs_rj= line.substr()
      // rec.zinsanpassungstermin= line.substr()

      // rec.bonitaet= line.substr()
      // rec.ausfallrisiko= line.substr()
      rec.zinssatz= parseInt(line.substr(190, 5)) / 1000
      rec.refzinssatz= line.substr(195, 20)
      // rec.minzinssatz= line.substr()
      rec.endstand_fj0= parseInt(line.substr(296, 14)) / 100
      rec.endstand_fj1= parseInt(line.substr(310, 14)) / 100
      rec.endstand_fj2= parseInt(line.substr(324, 14)) / 100
      rec.endstand_fj3= parseInt(line.substr(338, 14)) / 100
      rec.endstand_fj4= parseInt(line.substr(352, 14)) / 100
      // rec.endstand_fj5= parseInt(line.substr(, 14)) / 100
      break

    case '04':   // vermögen und forderungen
      tableName = 'vermoegenshaushalt'
      rec.ansatz_uab= line.substr(38, 3)
      rec.ansatz_ugl= line.substr(41, 3)
      // rec.konto_grp= line.substr()
      // rec.konto_ugl= line.substr()
      // rec.sonst_ugl= line.substr()
      // rec.vorhabencode= line.substr()
      rec.id_vhh= line.substr(23, 15).trim()
      rec.sektor= line.substr(50, 2)
      rec.land= line.substr(52, 2)

      // rec.mvag_vhh= line.substr()
      // rec.ansatz_text= line.substr()
      rec.konto_text= line.substr(198, 80).trim()
      rec.endstand_vj= parseInt(line.substr(70, 14)) / 100
      rec.zugang= parseInt(line.substr(84, 14)) / 100
      rec.abgang= parseInt(line.substr(98, 14)) / 100
      rec.aenderung= parseInt(line.substr(112, 14)) / 100
      rec.endstand_rj= parseInt(line.substr(126, 14)) / 100

      // rec.abschreibung= line.substr()
      // rec.umbuchung= line.substr()
      // rec.hoehe= line.substr()
      rec.ersaetze= parseInt(line.substr(140, 14)) / 100  // einnahmen aus guthaben
      // rec.zinsen= line.substr()
      // rec.verzinsungsart= line.substr()
      rec.waehrung= line.substr(54, 3)
      rec.laufzeit_von= line.substr(154, 6)
      rec.laufzeit_bis= line.substr(160, 6)
      rec.fbn= line.substr(191, 7)
      rec.isin= line.substr(58, 12)
      rec.notleidend= line.substr(57, 1)
      // rec.minleasing= line.substr()
      // rec.nachweis= line.substr()
      // rec.wechselkurs_zug= line.substr()
      // rec.wechselkurs_vj= line.substr()
      // rec.wechselkurs_rj= line.substr()
      // rec.zinsanpassungstermin= line.substr()

      // rec.bonitaet= line.substr()
      // rec.ausfallrisiko= line.substr()
      rec.zinssatz= parseInt(line.substr(166, 5)) / 1000
      rec.refzinssatz= line.substr(171, 20).trim()
      // rec.minzinssatz= line.substr()
      // rec.endstand_fj0= line.substr()
      // rec.endstand_fj1= line.substr()
      // rec.endstand_fj2= line.substr()
      // rec.endstand_fj3= line.substr()
      // rec.endstand_fj4= line.substr()
      // rec.endstand_fj5= line.substr()
      break

    case '05':   // übrige vermögenskonten
      tableName = 'vermoegenshaushalt'
      rec.ansatz_uab= line.substr(38, 3)
      rec.ansatz_ugl= line.substr(41, 3)
      // rec.konto_grp= line.substr()
      // rec.konto_ugl= line.substr()
      // rec.sonst_ugl= line.substr()
      // rec.vorhabencode= line.substr()
      rec.id_vhh= line.substr(23, 15).trim()
      // rec.sektor= line.substr(50, 2)
      // rec.land= line.substr(52, 2)

      // rec.mvag_vhh= line.substr()
      // rec.ansatz_text= line.substr()
      rec.konto_text= line.substr(120, 80).trim()
      rec.endstand_vj= parseInt(line.substr(50, 14)) / 100
      rec.zugang= parseInt(line.substr(64, 14)) / 100
      rec.abgang= parseInt(line.substr(78, 14)) / 100
      rec.aenderung= parseInt(line.substr(92, 14)) / 100
      rec.endstand_rj= parseInt(line.substr(106, 14)) / 100

      // rec.abschreibung= line.substr()
      // rec.umbuchung= line.substr()
      // rec.hoehe= line.substr()
      // rec.ersaetze= parseInt(line.substr(140, 14)) / 100  // einnahmen aus guthaben
      // rec.zinsen= line.substr()
      // rec.verzinsungsart= line.substr()
      // rec.waehrung= line.substr(54, 3)
      // rec.laufzeit_von= line.substr(154, 6)
      // rec.laufzeit_bis= line.substr(160, 6)
      // rec.fbn= line.substr(191, 7)
      // rec.isin= line.substr(58, 12)
      // rec.notleidend= line.substr(57, 1)
      // rec.minleasing= line.substr()
      // rec.nachweis= line.substr()
      // rec.wechselkurs_zug= line.substr()
      // rec.wechselkurs_vj= line.substr()
      // rec.wechselkurs_rj= line.substr()
      // rec.zinsanpassungstermin= line.substr()

      // rec.bonitaet= line.substr()
      // rec.ausfallrisiko= line.substr()
      // rec.zinssatz= parseInt(line.substr(166, 5)) / 1000
      // rec.refzinssatz= line.substr(171, 20).trim()
      // rec.minzinssatz= line.substr()
      // rec.endstand_fj0= line.substr()
      // rec.endstand_fj1= line.substr()
      // rec.endstand_fj2= line.substr()
      // rec.endstand_fj3= line.substr()
      // rec.endstand_fj4= line.substr()
      // rec.endstand_fj5= line.substr()
      break

    case '06':
      tableName = 'personal'
      rec.ansatz_uab= line.substr(24, 3)
      rec.ansatz_ugl= line.substr(26, 3)
      rec.meldegruppe= line.substr(23, 1)
      rec.personenkreis= line.substr(30, 1)
      rec.vzae= parseInt(line.substr(31, 14)) / 100
      rec.koepfe= parseInt(line.substr(45, 14)) / 100
      // rec.vzae_fj0= line.substr()
      // rec.koepfe_fj0= line.substr()
      // rec.vzae_fj1= line.substr()
      // rec.koepfe_fj1= line.substr()
      break

    case '07':
      tableName = 'sonstige_daten'
      let positionsnummer07 = line.substr(23, 3)
      let wert = parseInt(line.substr(26, 14)) / 100
      if (positionsnummer07 === '001') {
        rec.hebesatz1 = wert
      }
      else if (positionsnummer07 === '002') {
        rec.hebesatz2 = wert
      }
      else {
        console.log(`Zeile ${lineNum} Satzart 07 - unbekannte positionsnummer ${positionsnummer}.`)
      }
      break

    case '08':
      tableName = 'beteiligungen'
      rec.id= line.substr(23, 14)
      // rec.id_vhh= line.substr()
      rec.name_einheit= line.substr(175, 80).trim()
      rec.adresse= line.substr(255, 40).trim()
      rec.postleitzahl= line.substr(295, 4)
      rec.ort= line.substr(299, 40)
      rec.sektor= line.substr(57, 2)
      rec.betverhaeltnis= line.substr(37, 1)
      rec.id_mutter= line.substr(38, 14)
      rec.betausmass= parseInt(line.substr(52, 5)) / 100
      // rec.gjahr_von= line.substr()
      rec.gjahr_bis= line.substr(59, 4) + '00-00'
      rec.stammkapital= parseInt(line.substr(63, 14)) / 100
      // rec.ekap_vj= line.substr()
      rec.ekap_gj= parseInt(line.substr(63, 14)) / 100
      // rec.bilanzsumme= line.substr()
      rec.verbindl_gesamt= parseInt(line.substr(77, 14)) / 100
      rec.verbindl_finanz= parseInt(line.substr(91, 14)) / 100
      rec.verbindl_gk= parseInt(line.substr(105, 14)) / 100
      rec.ueber_fehl= parseInt(line.substr(119, 14)) / 100
      // rec.gewinnaus_gk= line.substr()
      rec.vzae= parseInt(line.substr(147, 14)) / 100
      rec.koepfe= parseInt(line.substr(161, 14)) / 100
      // rec.guthaben= line.substr()
      // rec.forderungen= line.substr()
      // rec.gem_beitrag= line.substr()
      break

    case '09':
      tableName = 'haftungen'
      rec.id = line.substr()
      rec.id_haftung = line.substr(23, 15).trim()
      // rec.teil = line.substr()
      // rec.gruppe = line.substr()
      rec.haftungsnehmer = line.substr(156, 80).trim()
      rec.sektor = line.substr(38, 2)
      rec.laufzeit_von = line.substr(144, 6)
      rec.laufzeit_bis = line.substr(150, 6)
      // rec.solidar = line.substr()
      rec.anteil = parseInt(line.substr(41, 5)) / 188
      rec.haftungsrahmen = parseInt(line.substr(102, 14))  / 100
      rec.endstand_vj = parseInt(line.substr(46, 14)) / 100
      rec.zugang = parseInt(line.substr(60, 14))  / 100
      rec.abgang = parseInt(line.substr(74, 14))  / 100
      rec.endstand_rj = parseInt(line.substr(88, 14))  / 100
      rec.endstand_fj1 = parseInt(line.substr(330, 14))  / 100
      rec.endstand_fj2 = parseInt(line.substr(344, 14))  / 100
      rec.endstand_fj3 = parseInt(line.substr(358, 14))  / 100
      rec.endstand_fj4 = parseInt(line.substr(372, 14))  / 100
      // rec.endstand_fj5 = line.substr()
      break

    case '91':
      tableName = 'pension'
      let positionsnummer91 = line.substr(23, 3)
      // rec.fj_nr = line.substr()
      // rec.aufwendungen = line.substr()
      // rec.koepfe_r = line.substr()
      // rec.koepfe_rl = line.substr()
      // rec.koepfe_v = line.substr()
      // rec.koepfe_vl = line.substr()
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

  // prep sonstige_daten
  records.sonstige_daten = [ Object.assign(records.sonstige_daten[0], records.sonstige_daten[1]) ]

  // TODO prep pension


  // write to db
  for (tableName of Object.keys(records)) {
    if (tableName === 'dummy') {
      continue
    }
    await db(tableName).where(ghdWhereKeys).del()
    await db(tableName).insert(records[tableName])
    console.log(`${records[tableName].length} Datensätze in Tabelle ${tableName} geschrieben.`)
  }  // eo write part loop

}  // eo import txt 1997


// export all bestandteile
async function exportCsv(config, kennsatz) {

  await exportCsvFile(config, kennsatz, 'kennsatz', kennsatz)

  const bestandteilRecs = await db
    .select('*')
    .from('vrv_bestandteile')
    .where({
      vrv: kennsatz.vrv
    })

  for (const bestandteilRec of bestandteilRecs) {

    const dbRows = await db
      .select('*')
      .from(bestandteilRec.name)
      .where({
        gkz: config.gkz,
        finanzjahr: config.finanzjahr,
        // periode: config.periode,
        quartal: config.quartal,
        va_ra: config.va_ra,
        nva: config.nva,
        vrv: config.vrv
      })
      .orderBy('iid')

    if (dbRows.length > 0) {
      await exportCsvFile(config, dbRows, bestandteilRec.name, kennsatz)
    }
  }
} // eo write csv


// write csv file
async function exportCsvFile(config, data, bestandteilName, kennsatz) {

  let filePrefix = `GHD${config.finanzjahr}_${config.periode}${config.quartal}_${config.va_ra}_${config.gkz}_${kennsatz.gemeinde}_vrv${config.vrv}`
  filePrefix = filePrefix.replaceAll(/\W+/g, '_')
  let fileName = `${filePrefix}_${bestandteilName}.csv`

  const json2csvOpts = {
    // excelStrings: true,
    // withBOM: true,  // ??? maybe needed for excel
    delimiter: ';',
    // TODO transform should be replaced by formatter api (numberFormatter) when json2csv 6.x is available
    transforms: (item) => {
      // console.log(JSON.stringify(item))
      for (const key of Object.keys(item)) {
        if (typeof(item[key]) === 'number') {
            item[key] = item[key].toString().replace('.', ',')
          // item[key] = item[key].toLocaleString('de-DE')
        }
      }
      return item
    }
  }

  console.log(`Schreibe CSV-Datei ${fileName}.`)
  fileName = path.join(config.file_path, fileName)
  try {
    const csvData = json2csv.parse(data, json2csvOpts)
    require("fs").writeFileSync(fileName, csvData)
  }
  catch (ex) {
    console.log(ex)
  }
} // eo write csv


// export all bestandteile to an spread sheet file supported by XLSX
async function exportSpreadSheet(config, kennsatz, sheetType) {

  let filePrefix = `GHD${config.finanzjahr}_${config.periode}${config.quartal}_${config.va_ra}_${config.gkz}_${kennsatz.gemeinde}_vrv${config.vrv}`
  filePrefix = filePrefix.replaceAll(/\W+/g, '_')
  let fileName = `${filePrefix}.${sheetType}`
  fileName = path.join(config.file_path, fileName)
  const wb = XLSX.utils.book_new()

  let ws = XLSX.utils.json_to_sheet([kennsatz])
  XLSX.utils.book_append_sheet(wb, ws, 'kennsatz')

  const bestandteilRecs = await db
    .select('*')
    .from('vrv_bestandteile')
    .where({
      vrv: kennsatz.vrv
    })

  for (const bestandteilRec of bestandteilRecs) {

    const dbRows = await db
      .select('*')
      .from(bestandteilRec.name)
      .where({
        gkz: config.gkz,
        finanzjahr: config.finanzjahr,
        // periode: config.periode,
        quartal: config.quartal,
        va_ra: config.va_ra,
        nva: config.nva,
        vrv: config.vrv
      })
      .orderBy('iid')

    if (dbRows.length > 0) {
      let ws = XLSX.utils.json_to_sheet(dbRows)
      XLSX.utils.book_append_sheet(wb, ws, bestandteilRec.name)
    }
  }

  // write to file
  XLSX.writeFile(wb, fileName)
} // eo write ods



// do the exports
module.exports = {
  importXml,
  importTxt,
  db,
  exportCsv,
  exportSpreadSheet
}
