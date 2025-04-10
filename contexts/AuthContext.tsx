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
	login: (
		accessToken: string,
		refreshToken: string,
		email: string
	) => Promise<void>
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [userEmail, setUserEmail] = useState('')

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken')
		const email = localStorage.getItem('userEmail')
		if (accessToken) {
			setIsAuthenticated(true)
			setUserEmail(email || 'User')
		}
	}, [])

	const login = (accessToken: string, refreshToken: string, email: string) => {
		return new Promise<void>(resolve => {
			localStorage.setItem('accessToken', accessToken)
			localStorage.setItem('refreshToken', refreshToken)
			localStorage.setItem('userEmail', email)
			setIsAuthenticated(true)
			setUserEmail(email)
			resolve()
		})
	}

	const logout = () => {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('userEmail')
		setIsAuthenticated(false)
		setUserEmail('')
	}

	return (
		<AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
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
