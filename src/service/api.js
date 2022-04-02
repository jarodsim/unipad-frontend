import axios from 'axios'

const api = axios.create({
  baseURL: 'https://unipadback.herokuapp.com/',
})

export default api
