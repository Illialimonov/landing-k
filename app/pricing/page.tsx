'use client'

import { useState } from 'react'
import $api from '@/lib/http'

const PLANS = [
	{
		name: 'Starter',
		price: '$0',
		period: '/month',
		description: 'Get started with basic TikTok clip creation',
		benefits: [
			'1 YouTube video per month',
			'Up to 2 TikTok clips per video',
			'Basic AI highlight detection',
			'Standard video quality (720p)',
			'Community support',
		],
		buttonText: 'Get Started',
		endpoint: null,
	},
	{
		name: 'Creator',
		price: '$19',
		period: '/month',
		description: 'Perfect for individual content creators',
		benefits: [
			'Up to 10 YouTube videos per month',
			'Up to 5 TikTok clips per video',
			'Advanced AI optimization',
			'HD video quality (1080p)',
			'Email support',
		],
		buttonText: 'Get Started',
		endpoint: '/pro-link',
	},
	{
		name: 'Viral Pro',
		price: '$29',
		period: '/month',
		description: 'Go viral with unlimited power',
		benefits: [
			'Unlimited YouTube videos',
			'Unlimited TikTok clips',
			'Premium AI analysis & trends',
			'4K video quality',
			'Priority support 24/7',
		],
		buttonText: 'Get Started',
		endpoint: '/premium-link',
	},
]

export default function PricingPage() {
	const [loading, setLoading] = useState<string | null>(null)

	const handlePayment = async (endpoint: string | null) => {
		if (!endpoint) return

		setLoading(endpoint)
		try {
			const res = await $api.get(endpoint)
			const url = res.data
			if (url) {
				window.location.href = url
			} else {
				console.error('No checkout URL returned')
			}
		} catch (error) {
			console.error('Payment initiation failed:', error)
		} finally {
			setLoading(null)
		}
	}

	return (
		<section className='min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12'>
			<div className='absolute inset-0 w-full h-full'>
				<div className='absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl' />
				<div className='absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl' />
			</div>

			<div className='container mx-auto px-4 relative z-10'>
				<h1 className='text-4xl md:text-5xl font-bold text-center gradient-text mb-4'>
					Turn YouTube into TikTok Gold
				</h1>
				<p className='text-center text-muted-foreground mb-12 max-w-2xl mx-auto'>
					Paste your YouTube URL, let our AI craft viral TikTok clips, and watch
					your reach soar.
				</p>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
					{PLANS.map(plan => (
						<div
							key={plan.name}
							className='group relative bg-secondary/50 rounded-xl p-6 backdrop-blur-sm border border-muted-foreground/20 hover:border-primary/50 transition-all duration-300 hover:scale-105'
						>
							<div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity' />
							<div className='relative flex flex-col justify-between h-full'>
								<h2 className='text-2xl font-semibold text-white mb-2'>
									{plan.name}
								</h2>
								<p className='text-muted-foreground mb-2'>{plan.description}</p>
								<div>
									<div className='text-3xl font-bold text-white mb-4'>
										{plan.price}
										<span className='text-lg font-normal text-muted-foreground'>
											{plan.period}
										</span>
									</div>
									<ul className='space-y-2 mb-6'>
										{plan.benefits.map(benefit => (
											<li
												key={benefit}
												className='text-muted-foreground flex items-center'
											>
												<span className='text-primary mr-2'>✓</span> {benefit}
											</li>
										))}
									</ul>
								</div>
								<button
									onClick={() => handlePayment(plan.endpoint)}
									disabled={!plan.endpoint || loading === plan.endpoint}
									className='w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50'
								>
									{plan.buttonText}
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
