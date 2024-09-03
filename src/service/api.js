import axios from 'axios'

const api = axios.create({
  baseURL: 'https://unipad-backend.onrender.com',
})

export default api
