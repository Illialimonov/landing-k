import axios from 'axios'

export const API_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const $api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

$api.interceptors.request.use(
	config => {
		const token = localStorage.getItem('accessToken')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => Promise.reject(error)
)

$api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			try {
				const refreshToken = localStorage.getItem('refreshToken')
				if (!refreshToken) {
					console.error('No refresh token found in localStorage')
					throw new Error('No refresh token available')
				}
				console.log('Attempting to refresh token with:', refreshToken)

				const response = await axios.post(`${API_URL}/user/refresh-token`, {
					token: refreshToken,
				})

				const { access_token, refresh_token } = response.data
				console.log('New access token received:', access_token)
				localStorage.setItem('accessToken', access_token)
				localStorage.setItem('refreshToken', refresh_token)

				originalRequest.headers.Authorization = `Bearer ${access_token}`
				return $api(originalRequest)
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError)
				localStorage.removeItem('accessToken')
				localStorage.removeItem('refreshToken')
				window.location.href = '/login'
				return Promise.reject(refreshError)
			}
		}
		return Promise.reject(error)
	}
)

export default $api
