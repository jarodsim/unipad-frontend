import axios from 'axios'

const api = axios.create({
  baseURL: 'https://unipad.jcmcode.com.br/',
})

export default api
