import axios from 'axios'
const baseUrl = '/api/login'

const login = async crendetials => {
  const response = await axios.post(baseUrl, crendetials)
  return response.data
}

export default { login }