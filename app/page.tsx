import { VideoConverter } from '@/components/video-converter'
import { Features } from '@/components/features'
import { Testimonials } from '@/components/testimonials'
import { Button } from '@/components/ui/button'
import { ArrowRight, Wand2, Type, Brain, Sparkles } from 'lucide-react'
import Image from 'next/image'
import VideoCarousel from '@/components/video-carousel'

const SOCIAL_LOGOS = [
	{
		src: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_YouTube_%282015-2017%29.svg',
		alt: 'YouTube',
	},
	{
		src: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
		alt: 'TikTok',
	},
	{
		src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
		alt: 'Instagram',
	},
]

const HOW_IT_WORKS_ITEMS = [
	{
		title: 'Paste YouTube Link',
		label:
			'Simply paste your YouTube video URL and let our AI do the heavy lifting',
		icon: '🎬',
	},
	{
		title: 'AI Processing',
		label: 'Our AI analyzes your content to find the most engaging moments',
		icon: '🤖',
	},
	{
		title: 'Get Viral Clips',
		label: 'Download perfectly formatted clips ready for TikTok success',
		icon: '🚀',
	},
]

export default function Home() {
	return (
		<div className='flex flex-col min-h-screen'>
			{/* Hero Section */}
			<section className='relative hero-gradient min-h-screen flex items-center justify-center overflow-hidden'>
				<div className='absolute inset-0 w-full h-full'>
					<div className='absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl' />
					<div className='absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl' />
				</div>

				<div className='container mx-auto px-4 py-32 relative z-10'>
					<div className='text-center max-w-4xl mx-auto'>
						<h1 className='text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight'>
							Turn YouTube Videos into
							<br />
							Viral TikTok Content
						</h1>
						<p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12'>
							Our AI automatically transforms your long-form content into
							engaging short clips, optimized for maximum reach on TikTok
						</p>

						<div className='relative'>
							<VideoConverter />
							<div className='mt-4 text-center'>
								<p className='text-sm text-muted-foreground'>
									No credit card required • Free plan available
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
					<ArrowRight className='w-6 h-6 text-muted-foreground rotate-90' />
				</div>
			</section>

			{/* Social Proof */}
			<section className='bg-secondary/20 py-16'>
				<div className='container mx-auto px-4'>
					<div className='flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70'>
						{SOCIAL_LOGOS.map((logo, index) => (
							<div key={index} className='relative group rounded-lg'>
								<div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-md transition group-hover:blur-lg' />
								<div className='relative bg-secondary/50 p-4 rounded-lg'>
									<Image
										src={logo.src}
										alt={logo.alt}
										width={80}
										height={40}
										className='h-8 md:h-10 w-auto'
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className='py-32 features-gradient'>
				<div className='container mx-auto px-4'>
					<h2 className='text-4xl md:text-5xl font-bold text-center mb-20 gradient-text'>
						Minimize editing time,
						<br />
						maximize content creation
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
						{HOW_IT_WORKS_ITEMS.map((item, index) => (
							<div key={index} className='relative group'>
								<div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur transition group-hover:blur-md' />
								<div className='relative bg-background rounded-lg p-8 h-full'>
									<div className='h-48 mb-6 rounded-lg bg-secondary/50 flex items-center justify-center'>
										<span className='text-6xl'>{item.icon}</span>
									</div>
									<h3 className='text-xl font-semibold mb-4'>{item.title}</h3>
									<p className='text-muted-foreground'>{item.label}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* AI Features */}
			<section className='py-32 bg-background relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent' />
				<div className='container mx-auto px-4 relative'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
						<div>
							<h2 className='text-4xl md:text-5xl font-bold gradient-text mb-6'>
								AI-Powered Highlight Detection
							</h2>
							<p className='text-xl text-muted-foreground mb-8'>
								Our advanced AI analyzes your content to identify the most
								engaging moments, ensuring your clips capture the best parts of
								your videos.
							</p>
							<div className='space-y-6'>
								<div className='flex items-start gap-4'>
									<div className='p-2 rounded-lg bg-primary/10'>
										<Brain className='h-6 w-6 text-primary' />
									</div>
									<div>
										<h3 className='font-semibold mb-2'>
											Smart Content Analysis
										</h3>
										<p className='text-muted-foreground'>
											Automatically detects key moments, emotions, and
											engagement triggers
										</p>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<div className='p-2 rounded-lg bg-primary/10'>
										<Sparkles className='h-6 w-6 text-primary' />
									</div>
									<div>
										<h3 className='font-semibold mb-2'>
											Engagement Optimization
										</h3>
										<p className='text-muted-foreground'>
											Creates clips optimized for maximum viewer retention and
											engagement
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className='relative'>
							<div className='absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl' />
							<div className='relative bg-secondary/50 rounded-2xl p-8 aspect-square flex items-center justify-center'>
								<img
									src='https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=800&fit=crop'
									alt='AI Analysis Visualization'
									className='rounded-xl'
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* video carousel */}
			<VideoCarousel />

			{/* Auto Captions
			<section className='py-32 bg-secondary/50 relative overflow-hidden'>
				<div className='container mx-auto px-4'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
						<div className='order-2 lg:order-1 relative'>
							<div className='absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl' />
							<div className='relative bg-background rounded-2xl p-8 aspect-square flex items-center justify-center'>
								<img
									src='https://images.unsplash.com/photo-1600697394936-59934aa5951f?w=800&h=800&fit=crop'
									alt='Auto Captions Demo'
									className='rounded-xl'
								/>
							</div>
						</div>
						<div className='order-1 lg:order-2'>
							<h2 className='text-4xl md:text-5xl font-bold gradient-text mb-6'>
								Auto Captions & Translations
							</h2>
							<p className='text-xl text-muted-foreground mb-8'>
								Maximize your reach with automatically generated captions and
								translations, making your content accessible to a global
								audience.
							</p>
							<div className='space-y-6'>
								<div className='flex items-start gap-4'>
									<div className='p-2 rounded-lg bg-primary/10'>
										<Type className='h-6 w-6 text-primary' />
									</div>
									<div>
										<h3 className='font-semibold mb-2'>
											Accurate Transcription
										</h3>
										<p className='text-muted-foreground'>
											AI-powered speech recognition for precise captions
										</p>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<div className='p-2 rounded-lg bg-primary/10'>
										<Wand2 className='h-6 w-6 text-primary' />
									</div>
									<div>
										<h3 className='font-semibold mb-2'>
											Multi-Language Support
										</h3>
										<p className='text-muted-foreground'>
											Translate your content into multiple languages
											automatically
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section> */}

			<Features />
			<Testimonials />
		</div>
	)
}
