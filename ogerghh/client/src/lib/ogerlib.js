import { date, Dialog } from 'quasar'
const formatDate = date.formatDate

// get url base of app
export const getUrlBase = () => {
  const pathParts = window.location.pathname.split('/')
  if (pathParts[pathParts.length - 1] === 'index.html') {
    pathParts.pop()
  }
  let urlPath = pathParts.join('/')
  if (urlPath.substr(-1) !== '/') {
    urlPath += '/'
  }
  return [window.location.protocol, '//', window.location.host, urlPath].join('')
} // eo get url base

// error dlg for axios errors
export const axiosError = (error) => {
  const HttpStatus = require('http-status-codes')

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // Display only status-text, report details to console
    // We use HttpStatus.UNPROCESSABLE_ENTITY to display server answers that indicate
    // errors in the business logoc of the app. This could be done also with
    // status code OK (200), but it is easier to detect / handle this way.
    const fullMsg = `${error.response.status}: ${error.response.statusText}\n${error.response.data}`
    console.log(fullMsg)
    let displayMsg, displayTitle
    if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
      displayMsg = error.response.data
      displayTitle = 'Serverantwort'
    } else {
      displayMsg = `${error.response.status} ${error.response.statusText}`
      displayTitle = 'Serverfehler'
    }
    Dialog.create({
      title: displayTitle,
      message: displayMsg,
      ok: true
    })
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    Dialog.create({
      title: 'Sendefehler',
      message: error.message,
      ok: true
    })
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    Dialog.create({
      title: 'Allgemeiner Fehler',
      message: error.message,
      ok: true
    })
    console.log('Error', error.message)
  }
} // eo axious console.error(

// modified format date
// TODO read format from config file
export const oeFormatDate = (v, format = 'DD.MM.YYYY') => {
  /*
  // empty mysql-date handling OBSOLETE, because we use null instead
  if (typeof v === 'string') {
    if (v.trim().substr(0, 10) === '0000-00-00') {
      v = ''
    }
  }
  */
  return formatDate(v, format)
} // modified date format


// prepare paging perams for request
export const prepPagingParams = (params) => {
  const paramsOut = {}
  if (params.pagination.sortBy) {
    paramsOut.sort = [[params.pagination.sortBy, params.pagination.descending ? 'DESC' : 'ASC']]
  }
  const offset = (params.pagination.page - 1) * params.pagination.rowsPerPage
  Object.assign(
    paramsOut,
    params.filter ? { filter: params.filter } : undefined,
    params.pagination.rowsPerPage ? { limit: params.pagination.rowsPerPage } : undefined,
    offset ? { offset: offset } : undefined,
    { _dc: Date.now() }
  )
  return paramsOut
} // eo perep paging params
