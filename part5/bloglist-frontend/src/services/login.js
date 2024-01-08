const baseUrl = '/api/login'
import axios from 'axios'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const login = async crendetials => {
  const response = await axios.post(baseUrl, crendetials)
  console.log(response)
  return response.data
}

export default { login, setToken }