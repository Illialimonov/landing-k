'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import $api from '@/lib/http'
import { Clip } from '@/types'
import { ClipResults } from './clip-results'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { CustomProgress } from './custom-progress'

const FILLER_OPTIONS = [
	{ value: 'gta5', label: 'GTA 5', icon: '/icons/gta-5.png' },
	{
		value: 'minecraft',
		label: 'Minecraft Parkour',
		icon: '/icons/minecraft-parkour.png',
	},
	{
		value: 'press',
		label: 'Hydraulic Press',
		icon: '/icons/hydraulic-press.png',
	},
	{ value: 'truck', label: 'Cluster Truck', icon: '/icons/cluster-truck.png' },
	{ value: 'steep', label: 'Steep', icon: '/icons/steep.png' },
	{ value: 'random', label: 'Random', icon: '/icons/random.png' },
]

export function VideoConverter() {
	const [youtubeUrl, setYoutubeUrl] = useState('')
	const [filler, setFiller] = useState('random')
	const [numberOfClips, setNumberOfClips] = useState(3)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [clips, setClips] = useState<Clip[]>([])
	const [progress, setProgress] = useState(0)
	const [estimatedTime, setEstimatedTime] = useState('')
	const { toast } = useToast()
	const router = useRouter()
	const { isAuthenticated, tier, hasOneFreeConversion } = useAuth()

	// Расчёт примерного времени ожидания
	useEffect(() => {
		if (isLoading) {
			const minTime = numberOfClips * 60 // 1 минута на клип
			const maxTime = numberOfClips * 120 // 2 минуты на клип
			setEstimatedTime(`~${minTime}–${maxTime} seconds`)

			// Симуляция прогресса
			const interval = setInterval(() => {
				setProgress(prev => {
					if (prev >= 90) return prev
					return prev + 100 / (minTime * 2)
				})
			}, 1000)

			return () => clearInterval(interval)
		}
	}, [isLoading, numberOfClips])

	const isFreeUserRestricted = tier === 'FREE' && hasOneFreeConversion

	const handleConvert = async () => {
		if (!isAuthenticated) {
			router.push('/login')
			return
		}

		if (isFreeUserRestricted) {
			router.push('/pricing')
			return
		}

		if (!youtubeUrl.trim()) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Please enter a YouTube URL',
			})
			return
		}

		setIsLoading(true)
		setProgress(0)
		try {
			const response = await $api.post('/create', {
				youtubeURL: youtubeUrl,
				filler,
				numberOfClips,
			})
			console.log('Conversion response:', response.data)
			setClips(response.data)
			setProgress(100)
			toast({
				title: 'Success',
				description: 'Clips have been generated successfully!',
			})
			setYoutubeUrl('')
		} catch (err: any) {
			console.error('Conversion failed:', err.response?.data || err.message)
			toast({
				variant: 'destructive',
				title: 'Error',
				description: err.response?.data?.message || 'Failed to generate clips',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='flex flex-col'>
			<div className='relative max-w-3xl mx-auto'>
				<div className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75' />
				<div className='relative bg-background border rounded-lg p-2'>
					<div className='flex flex-col md:flex-row gap-2'>
						<Input
							type='text'
							placeholder='Paste YouTube video URL'
							value={youtubeUrl}
							onChange={e => setYoutubeUrl(e.target.value)}
							disabled={isLoading || isFreeUserRestricted}
							className='flex-1 text-lg py-6'
						/>
						<Select
							value={filler}
							onValueChange={setFiller}
							disabled={isLoading || isFreeUserRestricted}
						>
							<SelectTrigger className='w-full md:w-[200px]'>
								<SelectValue placeholder='Select filler' />
							</SelectTrigger>
							<SelectContent>
								{FILLER_OPTIONS.map((option, index) => (
									<SelectItem key={index} value={option.value}>
										<div className='flex items-center gap-2'>
											<Image
												src={option.icon}
												alt={option.label}
												width={32}
												height={32}
											/>
											<span>{option.label}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className='w-full md:w-[120px] flex flex-col gap-2'>
							<label className='text-sm text-muted-foreground'>
								Number of Clips: {numberOfClips}
							</label>
							<Slider
								value={[numberOfClips]}
								onValueChange={value => setNumberOfClips(value[0])}
								min={1}
								max={5}
								step={1}
								disabled={isLoading || isFreeUserRestricted}
								className='w-full'
							/>
						</div>
						<Button
							size='lg'
							onClick={handleConvert}
							disabled={isLoading}
							className='w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
						>
							{isFreeUserRestricted
								? 'Choose a Plan'
								: isLoading
								? 'Processing...'
								: 'Get Clips'}
							{!isLoading && !isFreeUserRestricted && (
								<ArrowRight className='ml-2 h-5 w-5' />
							)}
						</Button>
					</div>
				</div>
			</div>

			{isFreeUserRestricted && (
				<p className='text-center text-muted-foreground mt-4 max-w-3xl mx-auto'>
					You`ve used your free conversion. Unlock more features by selecting a
					plan in Pricing.
					<a href='/pricing' className='text-primary underline'>
						Pricing
					</a>
					.
				</p>
			)}

			{/* Модальное окно загрузки */}
			<Dialog open={isLoading}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Generating Clips</DialogTitle>
						<DialogDescription>
							Please wait while we process your video. Estimated time:{' '}
							{estimatedTime}
						</DialogDescription>
					</DialogHeader>
					<CustomProgress value={progress} className='w-full' />
				</DialogContent>
			</Dialog>

			<ClipResults clips={clips} />
		</div>
	)
}
