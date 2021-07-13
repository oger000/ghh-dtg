/*
*/

const fs = require('fs')
const csv = require(__dirname + '/lib/csvtojson')
// const xmlParser = require(__dirname + '/lib/xml2js')

const { db, exportCsv } = require(__dirname + '/lib/handle-ghd')


// separated because of await/async
async function fake_main() {

  const configGdt = __dirname + '/export-ghd.cfg'
  console.log('\n*******************')
  if(!fs.existsSync(configGdt)) {
    console.log(`Konfigurationsdatei ${configGdt} nicht gefunden.`)
    process.exit(1)
  }
  console.log(`Verwende Konfigurationsdatei ${configGdt}.`)

  const configRecs = await csv.fromFile(configGdt)
  let configNum = 0
  for (configRec of configRecs) {
    configNum++
    console.log(`Verarbeite Konfigurationseintrag ${configNum}.`)

    if (!configRec.handle || configRec.handle == '0') {
      console.log(`   Verarbeitung ist deaktiviert. Datensatz wird übersprungen. (${configRec.file_name})`)
      continue
    }

    console.log('Lese Kennsatz von DB.')
    const ksRows = await db
      .select('*')
      .from('kennsatz')
      .where({
        gkz: configRec.gkz,
        finanzjahr: configRec.finanzjahr,
        periode: configRec.periode,
        quartal: configRec.quartal,
        va_ra: configRec.va_ra,
        nva: configRec.nva,
        vrv: configRec.vrv
      })
    if (ksRows.length > 1) {
      console.log(`Mehr als 1 Kennsatz für ${configNum} vorhanden.`)
      continue;
    }
    if (ksRows.length === 0) {
      console.log(`Kein Kennsatz für ${configNum} vorhanden.`)
      continue;
    }

    const ksRow = ksRows[0]
    let filePrefix = `GHD${ksRow.finanzjahr}_${ksRow.periode}${ksRow.quartal}_${ksRow.va_ra}_${ksRow.gkz}_${ksRow.gemeinde}_vrv${ksRow.vrv}_`
    filePrefix = filePrefix.replaceAll(/\W+/g, '_')
    // console.log(filePrefix)
    const fileType = configRec.file_type.toLowerCase()
    const fileName = `${filePrefix}kennsatz.${fileType}`
    if (fileType === 'csv') {
      console.log(`Schreibe Kennsatz in Datei ${fileName}.`)
      // await exportCsv(configRec, filePrefix, fileType)
    } else {
      console.log(`Unbekannter Dateityp: ${configRec.filetype}`)
    }
  }
}  // eo main


// start the async main function
(async () => {
  try {
    await fake_main();
  } catch (ex) {
    console.log('Fehlerbehandlung nicht implementiert. Uncached error:')
    console.log(ex)
  }
  process.exit(0)
})();
