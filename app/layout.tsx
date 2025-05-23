import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import localFont from 'next/font/local'
import { AuthProvider } from '@/contexts/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ClientLayout from '@/components/client-layout'

// Use local font instead of Google font to avoid timeout issues
const inter = localFont({
	src: [
		{
			path: '../public/fonts/Inter-Regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../public/fonts/Inter-Medium.woff2',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../public/fonts/Inter-SemiBold.woff2',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../public/fonts/Inter-Bold.woff2',
			weight: '700',
			style: 'normal',
		},
	],
})

export const metadata: Metadata = {
	title: 'ViralCuts - AI-Powered Video Content Creation',
	description:
		'Transform your YouTube videos into viral TikTok content automatically',
	icons: {
		icon: '/favicon.jpg',
	},
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-W4MXD341BX"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-W4MXD341BX');
      `,
          }}
        ></script>
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
