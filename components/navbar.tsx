'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Scissors } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
	const { isAuthenticated, tier, logout } = useAuth()

	const formattedTier =
		tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()

	return (
		<nav className='fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center justify-between'>
				<Link href='/' className='flex items-center space-x-2'>
					<Scissors className='h-6 w-6 text-primary' />
					<span className='text-xl font-bold'>ViralCuts</span>
				</Link>

				<div className='hidden md:flex items-center space-x-6'>
					<Link
						href='/pricing'
						className='text-sm font-medium hover:text-primary'
					>
						Pricing
					</Link>
					<Link
						href='/contact'
						className='text-sm font-medium hover:text-primary'
					>
						Contact Us
					</Link>

					{isAuthenticated ? (
						<>
							<span className='text-sm font-medium text-muted-foreground'>
								Current plan: {formattedTier}
							</span>
							<Button variant='ghost' size='sm' onClick={logout}>
								Logout
							</Button>
						</>
					) : (
						<>
							<Link href='/login'>
								<Button variant='ghost' size='sm'>
									Login
								</Button>
							</Link>
							<Link href='/signup'>
								<Button size='sm'>Sign Up Free</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}
