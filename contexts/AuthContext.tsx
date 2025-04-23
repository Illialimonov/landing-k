'use client'

import $api from '@/lib/http'
import { useRouter } from 'next/navigation'
import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	userEmail: string
	tier: string
	hasOneFreeConversion: boolean
	login: (
		accessToken: string,
		refreshToken: string,
		email: string,
		tier: string,
		hasOneFreeConversion: boolean
	) => Promise<void>
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [userEmail, setUserEmail] = useState('')
	const [tier, setTier] = useState('FREE')
	const [hasOneFreeConversion, setHasOneFreeConversion] =
		useState<boolean>(false)
	const router = useRouter()

	useEffect(() => {
		const syncAuthState = async () => {
			const accessToken = localStorage.getItem('accessToken')
			const refreshToken = localStorage.getItem('refreshToken')

			if (!accessToken) {
				console.log(
					'[AuthProvider] No access token found, user not authenticated'
				)
				localStorage.removeItem('userEmail')
				localStorage.removeItem('tier')
				localStorage.removeItem('hasOneFreeConversion')
				setIsAuthenticated(false)
				setUserEmail('')
				setTier('FREE')
				setHasOneFreeConversion(false)
				return
				return
			}

			try {
				console.log('[AuthProvider] Fetching user data from /user/me')
				const res = await $api.get('/user/me')
				console.log(res)
				const { email, tier, hasOneFreeConversion } = res.data
				localStorage.setItem('userEmail', email)
				localStorage.setItem('tier', tier)
				localStorage.setItem(
					'hasOneFreeConversion',
					String(hasOneFreeConversion)
				)
				setIsAuthenticated(true)
				setUserEmail(email)
				setTier(tier)
				setHasOneFreeConversion(hasOneFreeConversion)
			} catch (error: any) {
				console.error(
					'[AuthProvider] Error fetching user data:',
					error.response?.data || error.message
				)
				if (error.response?.status === 401 && refreshToken) {
					// Пытаемся обновить токен
					try {
						console.log('[AuthProvider] Attempting to refresh token')
						const refreshResponse = await $api.post('/user/refresh-token', {
							token: refreshToken,
						})
						const { access_token, refresh_token, userDetails } =
							refreshResponse.data
						console.log('[AuthProvider] Token refreshed:', {
							access_token,
							userDetails,
						})

						// Обновляем localStorage и состояние
						localStorage.setItem('accessToken', access_token)
						localStorage.setItem('refreshToken', refresh_token)
						localStorage.setItem('userEmail', userDetails.email)
						localStorage.setItem('tier', userDetails.tier)
						localStorage.setItem(
							'hasOneFreeConversion',
							String(userDetails.hasOneFreeConversion)
						)
						setIsAuthenticated(true)
						setUserEmail(userDetails.email)
						setTier(userDetails.tier)
						setHasOneFreeConversion(userDetails.hasOneFreeConversion)
					} catch (refreshErr: any) {
						console.error(
							'[AuthProvider] Token refresh failed:',
							refreshErr.response?.data || refreshErr.message
						)
						logout()
						router.push('/login')
					}
				} else {
					console.log('[AuthProvider] No valid tokens, logging out')
					logout()
					router.push('/login')
				}
			}
		}

		syncAuthState()
	}, [])

	const login = (
		accessToken: string,
		refreshToken: string,
		email: string,
		tier: string,
		hasOneFreeConversion: boolean
	) => {
		return new Promise<void>(resolve => {
			localStorage.setItem('accessToken', accessToken)
			localStorage.setItem('refreshToken', refreshToken)
			localStorage.setItem('userEmail', email)
			localStorage.setItem('tier', tier)
			localStorage.setItem('hasOneFreeConversion', String(hasOneFreeConversion))
			setIsAuthenticated(true)
			setUserEmail(email)
			setTier(tier)
			setHasOneFreeConversion(hasOneFreeConversion)
			resolve()
		})
	}

	const logout = () => {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('userEmail')
		localStorage.removeItem('tier')
		localStorage.removeItem('hasOneFreeConversion')
		setIsAuthenticated(false)
		setUserEmail('')
		setTier('FREE')
		setHasOneFreeConversion(false)
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				userEmail,
				tier,
				hasOneFreeConversion,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
