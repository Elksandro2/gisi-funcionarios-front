import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_BACK_URL ?? 'http://localhost:8080/v1',
})

api.interceptors.request.use(
    async (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api