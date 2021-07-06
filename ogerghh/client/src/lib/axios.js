import axios from 'axios'
import { getUrlBase } from '../lib/ogerlib'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: getUrlBase() })
const api = axios.create({ baseURL: getUrlBase(), timeout: 2500 })

export default api
