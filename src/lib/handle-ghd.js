
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
  'vorhaben'
  // 'sonstige_daten'  // moved to kennsatz
]

const ghdWhereKeys = {}



// handle xml data and prepare for database
async function handleXml(config, data) {
  if (config.vrv == 2015) {
    await handleXml2015(config, data)
  }
  else if (config.vrv == 1997) {
    console.log('Datenstruktur 1997 (XML) noch nicht implementiert.')
  }
  else {
    console.log(`Datenstruktur ${config.vrv} nicht vorgesehen.`)
  }
}  // eo handle xml


// put xml data structure (vrv 2015 ghd xml 3.7) to database
async function handleXml2015(config, data) {

  ghdWhereKeys.va_ra = config.va_ra
  ghdWhereKeys.gkz = data.kennsatz.gkz,
  ghdWhereKeys.finanzjahr = data.kennsatz.finanzjahr,
  ghdWhereKeys.quartal = data.kennsatz.quartal
  // ghdWhereKeys.nachtrag_num = data.kennsatz.nachtrag_num


  // prepare kennsatz und gesamt-ghd
  delete data.kennsatz.$  // specific to xml library
  const kennsatz = Object.assign({}, data.kennsatz)
  for (const part of xmlParts2015) {
    delete kennsatz[part]
  }

  // move hebesatz from sonstige_daten to kennsatz for simplicity
  // because hebesatz1 and hebesatz2 are the only properties of sonstige_daten for now
  kennsatz.hebesatz1 = data.kennsatz.sonstige_daten.hebesatz1
  kennsatz.hebesatz2 = data.kennsatz.sonstige_daten.hebesatz2
  delete kennsatz.sonstige_daten

  // cleanup global ghd object
  for (const prop in kennsatz) {
    delete data.kennsatz[prop]
  }
  delete data.kennsatz.sonstige_daten


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

    Object.assign(partData, ghdWhereKeys)
    await db(tableName).insert(records)
    console.log(`   ${records.length} Datensätze geschrieben.`)
  }  // eo part loop

  console.log('\n***Unbehandelte Daten:')
  console.log(JSON.stringify(data))

}  // eo handle xml 2015


// do the exports
module.exports = {
  handleXml
}
