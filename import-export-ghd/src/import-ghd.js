/*
*/

const fs = require('fs')
const csv = require(__dirname + '/lib/csvtojson')
const xmlParser = require(__dirname + '/lib/xml2js')

const { importXml, importTxt } = require(__dirname + '/lib/handle-ghd')


// separated because of await/async
async function fake_main() {

  const configGdt = __dirname + '/import-ghd.cfg'
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
    console.log(`Verarbeite Konfigurationseintrag ${configNum} für Datei ${configRec.file_name}.`)

    if (!configRec.handle.trim()) {
      console.log(`   Verarbeitung ist deaktiviert. Datensatz wird übersprungen.`)
      continue
    }

    if(!fs.existsSync(configRec.file_name) || !configRec.file_name.trim()) {
      console.log(`Datendatei ${configRec.file_name} nicht gefunden oder leer.`)
      continue
    }

    console.log(`Lese ${configRec.file_name}.`)

    configRec.va_ra = configRec.va_ra.toUpperCase()
    if(configRec.va_ra !== 'VA' && configRec.va_ra !== 'RA') {
      console.log(`Fehlerhafte va_ra Angabe: ${configRec.va_ra}.`)
      continue
    }


    let fileType = configRec.file_name.split('.').pop().toUpperCase()
    console.log(`Verwende Dateityp ${fileType}.`)
    if (fileType == 'XML') {
      const xmlContent = fs.readFileSync(configRec.file_name).toString()
      const ghdObj = await xmlParser.parseStringPromise(xmlContent)
      await importXml(configRec, ghdObj)
    }
    else if (fileType == 'TXT') {
      const txtContent = fs.readFileSync(configRec.file_name, { encoding: 'latin1' }).toString()
      await importTxt(configRec, txtContent)
    } else {
      console.log(`Unbekannter Dateityp: ${fileType}`)
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
