import axios from 'axios'

const $api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
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
	response => {
		if (response.data?.access_token && response.data?.user_details) {
			const { access_token, refresh_token, user_details } = response.data
			const tier = user_details?.tier || 'FREE'
			localStorage.setItem('accessToken', access_token)
			localStorage.setItem('refreshToken', refresh_token)
			localStorage.setItem('tier', tier)
		}
		return response
	},
	async error => {
		const originalRequest = error.config
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			error.config.url !== '/user/login'
		) {
			originalRequest._retry = true
			try {
				const refreshToken = localStorage.getItem('refreshToken')
				const response = await axios.post(
					`${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`,
					{ token: refreshToken }
				)
				const { access_token, refresh_token, user_details } = response.data
				const tier = user_details?.tier || 'FREE'
				localStorage.setItem('accessToken', access_token)
				localStorage.setItem('refreshToken', refresh_token)
				localStorage.setItem('tier', tier)
				originalRequest.headers.Authorization = `Bearer ${access_token}`
				return $api(originalRequest)
			} catch (refreshError) {
				// Если обновление токена не удалось, выполняем logout
				localStorage.removeItem('accessToken')
				localStorage.removeItem('refreshToken')
				localStorage.removeItem('userEmail')
				localStorage.removeItem('tier')
				window.location.href = '/login'
			}
		}
		return Promise.reject(error)
	}
)

export default $api
