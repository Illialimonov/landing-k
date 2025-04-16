'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import $api from '@/lib/http'
import { Clip } from '@/types'
import { ClipResults } from './clip-results'

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

const CLIP_OPTIONS = [
	{ value: '1', label: '1 Clip' },
	{ value: '3', label: '3 Clips' },
	{ value: '5', label: '5 Clips' },
]

export function VideoConverter() {
	const [youtubeUrl, setYoutubeUrl] = useState('')
	const [filler, setFiller] = useState('random')
	const [numberOfClips, setNumberOfClips] = useState('3')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [clips, setClips] = useState<Clip[]>([])
	const { toast } = useToast()

	const handleConvert = async () => {
		if (!youtubeUrl.trim()) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Please enter a YouTube URL',
			})
			return
		}

		setIsLoading(true)
		try {
			const response = await $api.post('/create', {
				youtubeURL: youtubeUrl,
				filler,
				numberOfClips: parseInt(numberOfClips),
			})
			console.log('Conversion response:', response.data)
			setClips(response.data)
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
							disabled={isLoading}
							className='flex-1 text-lg py-6'
						/>
						<Select
							value={filler}
							onValueChange={setFiller}
							disabled={isLoading}
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
						<Select
							value={numberOfClips}
							onValueChange={setNumberOfClips}
							disabled={isLoading}
						>
							<SelectTrigger className='w-full md:w-[120px]'>
								<SelectValue placeholder='Clips' />
							</SelectTrigger>
							<SelectContent>
								{CLIP_OPTIONS.map((option, index) => (
									<SelectItem key={index} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							size='lg'
							onClick={handleConvert}
							disabled={isLoading}
							className='w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
						>
							{isLoading ? 'Processing...' : 'Get Clips'}
							{!isLoading && <ArrowRight className='ml-2 h-5 w-5' />}
						</Button>
					</div>
				</div>
			</div>
			<ClipResults clips={clips} />
		</div>
	)
}
