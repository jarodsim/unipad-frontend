import axios from 'axios'

const api = axios.create({
  baseURL: 'https://unipadbackend.jarod.dev/',
})

export default api
