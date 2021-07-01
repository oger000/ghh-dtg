
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
