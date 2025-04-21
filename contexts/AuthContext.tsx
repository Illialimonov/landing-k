'use client'

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

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken')
		const email = localStorage.getItem('userEmail')
		const storedTier = localStorage.getItem('tier') || 'FREE'
		const storedHasOneFreeConversion =
			localStorage.getItem('hasOneFreeConversion') === 'true'
		if (accessToken) {
			setIsAuthenticated(true)
			setUserEmail(email || 'User')
			setTier(storedTier)
			setHasOneFreeConversion(storedHasOneFreeConversion)
		}
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
