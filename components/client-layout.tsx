'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
	if (!googleClientId) {
		console.error(
			'NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined in environment variables'
		)
	}

	return (
		<GoogleOAuthProvider clientId={googleClientId || ''}>
			<AuthProvider>
				<ThemeProvider attribute='class' defaultTheme='dark'>
					<div className='relative min-h-screen'>
						<Navbar />
						<main>{children}</main>
						<Footer />
					</div>
					<Toaster />
				</ThemeProvider>
			</AuthProvider>
		</GoogleOAuthProvider>
	)
}
