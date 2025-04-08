'use client'

import $api from '@/lib/http'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			await $api.post('/user/register', { email, password })
			router.push('/login')
		} catch (err: any) {
			setError(err.response?.data?.message || 'Registration error')
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
						Registration
					</h2>
					{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
					<form onSubmit={handleRegister} className='space-y-6'>
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
							Sign up
						</button>
					</form>
					<p className='text-center text-muted-foreground mt-6'>
						Already have an account?{' '}
						<a href='/login' className='text-primary hover:underline'>
							Log in
						</a>
					</p>
				</div>
			</div>
		</section>
	)
}
