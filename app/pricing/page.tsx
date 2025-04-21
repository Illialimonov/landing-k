'use client'

import { useState } from 'react'
import $api from '@/lib/http'
import { useAuth } from '@/contexts/AuthContext'

const PLANS = [
	{
		name: 'Starter - Free',
		tier: 'FREE',
		price: '$0',
		period: '/month',
		description: 'Try the core features with no commitment.',
		includes: [
			{
				title: '🎬 1 Free Clip Conversion',
				description: ' - Experience the workflow with no strings attached',
			},
			{
				title: '📹 480p Export Quality',
				description: ' - Fast, lightweight previews perfect for testing',
			},
			{
				title: '🎮 Access to 1 Gameplay Template',
				description: ' - Try out our viral gameplay overlay',
			},
			{
				title: '🔥 AI-Generated Hashtags',
				description: ' - Get optimized tags to boost your first post',
			},
		],
		attractiveInfo:
			'🚀 Ready to go unlimited? Upgrade to Pro or Premium anytime.',
		buttonText: 'Get Started',
		endpoint: null,
	},
	{
		name: 'Pro',
		tier: 'PRO',
		price: '$19',
		period: '/month',
		description:
			'For solo creators looking to automate and grow their short-form content.',
		includes: [
			{
				title: '🎬 Unlimited Clip Generation',
				description: ' - Create as many clips as you want, no monthly limits',
			},
			{
				title: '✂️ Basic AI Smart Splitting',
				description: ' - Automatically detects key moments to clip',
			},
			{
				title: '📺 Up to 3 Clips Per Session',
				description: ' - Generate multiple clips at once',
			},
			{
				title: '🎮 Access to 5 Gameplay Templates',
				description: ' - Choose from viral-ready gameplay overlays',
			},
			{
				title: '📹 720p Max Export Resolution',
				description: ' - Optimized for TikTok and Reels',
			},
			{
				title: '📏 Supports YouTube Videos up to 15 Minutes Long',
			},
			{
				title: '🔥 Auto-Generated Hashtags',
				description: ' - Boost your reach with trending, tailored tags',
			},
		],
		buttonText: 'Get Started',
		endpoint: '/pro-link',
	},
	{
		name: 'Premium',
		tier: 'PREMIUM',
		price: '$29',
		period: '/month',
		description:
			'For power users and agencies who want full creative control and maximum output. \n\nEverything in Pro, plus:',
		includes: [
			{
				title: '✂️ Advanced AI Smart Splitting',
				description: ' - Better scene detection for higher-impact clips',
			},
			{
				title: '📺 Up to 5 Clips Per Session',
				description: ' - Speed up your workflow with batch processing',
			},
			{
				title: '🎮 Access to 10 Gameplay Templates',
				description: ' - More variety to match your niche or audience',
			},
			{
				title: '📹 1080p Max Export Resolution',
				description: ' - High-definition clips for a professional look',
			},
			{
				title: '📏 Supports YouTube Videos up to 30 Minutes Long',
			},
			{
				title: '🔥 Auto-Generated Hashtags for Virality',
				description: ' - Smarter tags based on video context and trends',
			},
		],
		buttonText: 'Get Started',
		endpoint: '/premium-link',
	},
]

export default function PricingPage() {
	const [loading, setLoading] = useState<string | null>(null)
	const { tier } = useAuth()

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

				<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[1440px] mx-auto'>
					{PLANS.map(plan => {
						const isCurrentPlan = plan.tier === tier
						return (
							<div
								key={plan.name}
								className='group relative bg-secondary/50 rounded-xl p-6 backdrop-blur-sm border border-muted-foreground/20 hover:border-primary/50 transition-all duration-300 hover:scale-105'
							>
								<div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity' />
								<div className='relative flex flex-col justify-between h-full'>
									<div>
										<h2 className='text-2xl font-semibold text-white mb-2'>
											{plan.name}
										</h2>
										<p className='text-muted-foreground mb-2'>
											{plan.description}
										</p>
									</div>

									<div className='max-lg:mb-4'>
										<div className='text-3xl font-bold text-white mb-4'>
											{plan.price}
											<span className='text-lg font-normal text-muted-foreground'>
												{plan.period}
											</span>
										</div>
										<ul className='space-y-4 mb-6'>
											{plan.includes.map(item => (
												<li
													key={item.title}
													className='text-muted-foreground flex items-center justify-start'
												>
													<p className='font-normal'>
														<span className='font-bold'>{item.title}</span>
														{item.description}
													</p>
												</li>
											))}
										</ul>
										{plan.attractiveInfo && (
											<p className='font-semibold'>{plan.attractiveInfo}</p>
										)}
									</div>
									<button
										onClick={() => handlePayment(plan.endpoint)}
										disabled={
											!plan.endpoint ||
											loading === plan.endpoint ||
											isCurrentPlan
										}
										className='w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50'
									>
										{isCurrentPlan ? 'Current Plan' : plan.buttonText}
									</button>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
