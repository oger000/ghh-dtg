/*
*/

const fs = require('fs')
const csv = require(__dirname + '/lib/csvtojson')
const xmlParser = require(__dirname + '/lib/xml2js')

const { handleXml } = require(__dirname + '/lib/handle-ghd')


// separated because of await/async
async function fake_main() {

  const configGdt = __dirname + '/config-ghd.csv'
  console.log(`Verwende Konfigurationsdatei ${configGdt}.`)
  if(!fs.existsSync(configGdt)) {
    console.log(`Konfigurationsdatei nicht gefunden.`)
    process.exit(1)
  }

  const configRecs = await csv.fromFile(configGdt)
  let configNum = 0
  for (configRec of configRecs) {
    configNum++
    console.log(`Verarbeite Konfigurationseintrag ${configNum}.`)

    if (!configRec.handle) {
      config.log('Verarbeitung ist deaktiviert. Datensatz wird übersprungen.')
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
      await handleXml(configRec, ghdObj)
    }
    else if (fileType == 'TXT') {
      console.log('Dateistruktur TXT noch nicht implementiert.')
      // handleCsv(configRec)
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
