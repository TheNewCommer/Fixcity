import axios from 'axios'
const api = axios.create()
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('fmc_token')
  if (t) cfg.headers['Authorization'] = `Bearer ${t}`
  return cfg
})
export default api
