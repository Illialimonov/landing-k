'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Loader } from './ui/loader'

const VIDEOS = [
	'https://storage.googleapis.com/tiktok1234/hI2fRz90j7GE.mp4',
	'https://storage.googleapis.com/tiktok1234/MZnM1cvk5a2_.mp4',
	'https://storage.googleapis.com/tiktok1234/NVLC54K_oipf.mp4',
	'https://storage.googleapis.com/tiktok1234/aJc-lm1k5T2P.mp4',
	'https://storage.googleapis.com/tiktok1234/co_BWF2tZoky.mp4',
	'https://storage.googleapis.com/tiktok1234/C3VsKF6leEtZ.mp4',
	'https://storage.googleapis.com/tiktok1234/u5pBSLCFHFUW.mp4',
	'https://storage.googleapis.com/tiktok1234/Ko1SEcwQ9rTS.mp4',
]

export default function VideoCarousel() {
	const [loadedVideos, setLoadedVideos] = useState<boolean[]>(
		new Array(VIDEOS.length).fill(false)
	)
	const [errorVideos, setErrorVideos] = useState<boolean[]>(
		new Array(VIDEOS.length).fill(false)
	)

	const handleVideoLoaded = (index: number) => {
		setLoadedVideos(prev => {
			const newLoaded = [...prev]
			newLoaded[index] = true
			return newLoaded
		})
	}

	const handleVideoError = (index: number) => {
		setErrorVideos(prev => {
			const newErrors = [...prev]
			newErrors[index] = true
			return newErrors
		})
		setLoadedVideos(prev => {
			const newLoaded = [...prev]
			newLoaded[index] = true // Скрываем лоадер, чтобы показать ошибку
			return newLoaded
		})
	}

	useEffect(() => {
		// Предварительная проверка доступности видео (опционально)
		VIDEOS.forEach((src, index) => {
			const video = document.createElement('video')
			video.src = src
			video.preload = 'metadata'
			video.onloadeddata = () => handleVideoLoaded(index)
			video.onerror = () => handleVideoError(index)
			video.load()
		})
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
									errorVideos[index] ? (
										<div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-500/30 text-white text-sm p-4'>
											Failed to load video. Please try again later.
										</div>
									) : (
										<video
											src={src}
											controls
											preload='metadata'
											className='absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out'
											onLoadedData={() => handleVideoLoaded(index)}
											onError={() => handleVideoError(index)}
										/>
									)
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
