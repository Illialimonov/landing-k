'use client'

import $api from '@/lib/http'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()
	const { login } = useAuth()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const res = await $api.post('/user/login', { email, password })
			const { access_token, refresh_token, userDetails } = res.data
			const userEmail = email
			await login(access_token, refresh_token, userEmail)
			router.push('/')
		} catch (err: any) {
			setError(err.response?.data?.message || 'Login error')
		}
	}

	const handleGoogleLogin = async (credentialResponse: any) => {
		try {
			const decoded: any = jwtDecode(credentialResponse.credential)
			const googleEmail = decoded.email
			console.log(
				'Sending Google login request:',
				credentialResponse.credential
			)
			const res = await $api.post('/user/google', {
				credentials: credentialResponse.credential,
			})
			console.log('Google login response:', res.data)
			const { access_token, refresh_token } = res.data || {}
			if (access_token && refresh_token) {
				await login(access_token, refresh_token, googleEmail)
				router.push('/')
			} else {
				setError('Google login failed: no tokens received')
			}
		} catch (err: any) {
			console.error('Google login error:', err.response?.data || err.message)
			setError(err.response?.data?.message || 'Google login error')
		}
	}

	return (
		<section className='min-h-screen flex items-center justify-center bg-background relative overflow-hidden'>
			<div className='absolute inset-0 w-full h-full'>
				<div className='absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl' />
				<div className='absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl' />
			</div>

			<div className='container mx-auto px-4 relative z-10'>
				<div className='max-w-md mx-auto bg-secondary/50 rounded-xl p-8 backdrop-blur-sm'>
					<h2 className='text-3xl md:text-4xl font-bold text-center gradient-text mb-6'>
						Log in
					</h2>
					{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
					<form onSubmit={handleLogin} className='space-y-6'>
						<div>
							<label
								className='block text-muted-foreground mb-2'
								htmlFor='email'
							>
								Email
							</label>
							<input
								type='email'
								id='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								className='w-full p-3 rounded-lg bg-background border border-muted-foreground/20 text-white focus:outline-none focus:ring-2 focus:ring-primary'
								required
							/>
						</div>
						<div>
							<label
								className='block text-muted-foreground mb-2'
								htmlFor='password'
							>
								Password
							</label>
							<input
								type='password'
								id='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								className='w-full p-3 rounded-lg bg-background border border-muted-foreground/20 text-white focus:outline-none focus:ring-2 focus:ring-primary'
								required
							/>
						</div>
						<button
							type='submit'
							className='w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition'
						>
							Log in
						</button>
					</form>

					<div className='my-6 text-center text-muted-foreground'>or</div>

					<GoogleOAuthProvider
						clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
					>
						<div className='flex justify-center'>
							<GoogleLogin
								onSuccess={handleGoogleLogin}
								onError={() => setError('Google login error')}
							/>
						</div>
					</GoogleOAuthProvider>

					<p className='text-center text-muted-foreground mt-6'>
						Already have an account?{' '}
						<a href='/signup' className='text-primary hover:underline'>
							Sign up
						</a>
					</p>
				</div>
			</div>
		</section>
	)
}
