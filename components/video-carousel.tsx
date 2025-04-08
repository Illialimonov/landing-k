'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Loader } from './ui/loader'

const VIDEOS = [
	'https://storage.googleapis.com/tiktok1234/Xz_Npj-bZEyh_1.mp4',
	'https://storage.googleapis.com/tiktok1234/zKUpqBIrWjIG_1.mp4',
	'https://storage.googleapis.com/tiktok1234/Z-53TiGosrqg_1.mp4',
	'https://storage.googleapis.com/tiktok1234/3ydJFIYah087_1.mp4',
	'https://storage.googleapis.com/tiktok1234/jnL6VhENkjMR_1.mp4',
	'https://storage.googleapis.com/tiktok1234/CWjhcGw2nRRf_1.mp4',
	'https://storage.googleapis.com/tiktok1234/jDEYMjRpPBdd_1.mp4',
	'https://storage.googleapis.com/tiktok1234/04yKmfS2XNLV_1.mp4',
]

export default function VideoCarousel() {
	const [loadedVideos, setLoadedVideos] = useState<boolean[]>(
		new Array(VIDEOS.length).fill(false)
	)

	useEffect(() => {
		const timers = VIDEOS.map((_, index) => {
			return setTimeout(() => {
				setLoadedVideos(prev => {
					const newLoaded = [...prev]
					newLoaded[index] = true
					return newLoaded
				})
			}, index * 500)
		})

		return () => {
			timers.forEach(timer => clearTimeout(timer))
		}
	}, [])

	return (
		<section className='py-16 bg-background'>
			<div className='overflow-x-auto no-scrollbar px-4'>
				<div className='flex gap-4 md:gap-6 md:justify-center min-w-[1000px] md:min-w-[1500px]'>
					{VIDEOS.map((src, index) => (
						<motion.div
							initial={{ width: 160 }}
							animate={{ width: 160 }}
							whileHover={{ width: 400 }}
							transition={{ duration: 0.5, ease: 'easeInOut' }}
							key={index}
							className='relative rounded-xl bg-secondary/30 overflow-hidden h-[300px] md:h-[500px] flex-shrink-0 group'
						>
							<div className='w-full h-full'>
								{loadedVideos[index] ? (
									<video
										src={src}
										controls
										className='absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out'
									/>
								) : (
									<Loader />
								)}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
