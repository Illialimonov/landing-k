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

	const handleConvert = () => {
		// Will implement conversion logic later
		console.log('Converting:', { youtubeUrl, filler })
	}

	return (
		<div className='relative max-w-3xl mx-auto'>
			<div className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75' />
			<div className='relative bg-background border rounded-lg p-2'>
				<div className='flex flex-col md:flex-row gap-2'>
					<Input
						type='text'
						placeholder='Paste YouTube video URL'
						value={youtubeUrl}
						onChange={e => setYoutubeUrl(e.target.value)}
						className='flex-1 text-lg py-6'
					/>
					<Select value={filler} onValueChange={setFiller}>
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
					<Button
						size='lg'
						onClick={handleConvert}
						className='w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
					>
						Get Clips
						<ArrowRight className='ml-2 h-5 w-5' />
					</Button>
				</div>
			</div>
		</div>
	)
}
