import axios from 'axios'

const api = axios.create({
    baseURL: "https://unipadback.herokuapp.com/pad"
})

export default api