import axios from 'axios'

const api = axios.create({
  baseURL: 'https://unipad-backend.fly.dev/',
})

export default api
