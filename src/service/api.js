import axios from 'axios'

const api = axios.create({
  baseURL: 'https://unipadbackend.jarodmateus.com/',
})

export default api
