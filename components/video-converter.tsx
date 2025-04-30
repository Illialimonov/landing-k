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
	const { isAuthenticated, tier, hasOneFreeConversion, login } = useAuth()

	// Расчёт примерного времени ожидания
	useEffect(() => {
		if (isLoading) {
			const minTime = numberOfClips * 60 // 1 минута на клип
			const maxTime = numberOfClips * 120 // 2 минуты на клип
			setEstimatedTime(`~${minTime}–${maxTime} секунд`)

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

	const syncUserData = async () => {
		try {
			console.log('[VideoConverter] Синхронизация данных пользователя после конвертации')
			const res = await $api.get('/user/me')
			const { email, tier, hasOneFreeConversion } = res.data
			console.log(res.data)

			localStorage.setItem('userEmail', email)
			localStorage.setItem('tier', tier)
			localStorage.setItem('hasOneFreeConversion', String(hasOneFreeConversion))
			await login(
				localStorage.getItem('accessToken')!,
				localStorage.getItem('refreshToken')!,
				email,
				tier,
				hasOneFreeConversion
			)
		} catch (error: any) {
			console.error(
				'[VideoConverter] Ошибка синхронизации данных пользователя:',
				error.response?.data || error.message
			)
			toast({
				variant: 'destructive',
				title: 'Ошибка',
				description: 'Не удалось синхронизировать данные пользователя. Пожалуйста, войдите снова.',
			})
			router.push('/login')
		}
	}

	const handleConvert = async () => {
		if (!isAuthenticated) {
			toast({
				variant: 'destructive',
				title: 'Не авторизован',
				description: 'Пожалуйста, войдите в аккаунт для продолжения.',
			})
			router.push('/login')
			return
		}

		if (tier === 'FREE' && hasOneFreeConversion === false) {
			toast({
				variant: 'destructive',
				title: 'Лимит достигнут',
				description: 'Вы использовали бесплатную конверсию. Выберите платный тариф.',
			})
			router.push('/pricing')
			return
		}

		if (!youtubeUrl.trim()) {
			toast({
				variant: 'destructive',
				title: 'Ошибка',
				description: 'Пожалуйста, введите URL видео с YouTube',
			})
			return
		}

		setIsLoading(true)
		setProgress(0)
		try {
			const res = await $api.post('/create', {
				youtubeURL: youtubeUrl,
				filler,
				numberOfClips,
			})
			console.log('Ответ конвертации:', res.data)
			setClips(res.data)

			await syncUserData()

			setProgress(100)
			toast({
				title: 'Успех',
				description: 'Клипы успешно сгенерированы!',
			})
			setYoutubeUrl('')
		} catch (err: any) {
			console.error('Ошибка конвертации:', err.response?.data || err.message)
			const errorMessage =
				err.response?.data?.message || 'Не удалось сгенерировать клипы'
			toast({
				variant: 'destructive',
				title: 'Ошибка',
				description: errorMessage,
			})

			await syncUserData()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='flex flex-col'>
			<div className='relative max-w-4xl mx-auto'>
				<div className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75' />
				<div className='relative bg-background border rounded-lg p-2'>
					<div className='flex flex-col md:flex-row gap-2'>
						<Input
							type='text'
							placeholder='Вставьте URL видео с YouTube'
							value={youtubeUrl}
							onChange={e => setYoutubeUrl(e.target.value)}
							disabled={isLoading || (tier === 'FREE' && hasOneFreeConversion === false)}
							className='flex-1 text-lg py-3 md:py-6'
						/>
						<Select
							value={filler}
							onValueChange={setFiller}
							disabled={isLoading || (tier === 'FREE' && hasOneFreeConversion === false)}
						>
							<SelectTrigger className='w-full md:w-[200px] h-full'>
								<SelectValue placeholder='Выберите наполнитель' />
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
						<div className='w-full md:w-[160px] flex flex-col gap-2'>
							<label className='text-sm text-muted-foreground'>
								Количество клипов: {numberOfClips}
							</label>
							<Slider
								value={[numberOfClips]}
								onValueChange={value => setNumberOfClips(value[0])}
								min={1}
								max={5}
								step={1}
								disabled={isLoading || (tier === 'FREE' && hasOneFreeConversion === false)}
								className='w-full cursor-pointer'
							/>
						</div>
						{!isAuthenticated ? (
							<Button
								size='lg'
								onClick={handleConvert}
								disabled={isLoading}
								className='w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
							>
								Войти
							</Button>
						) : tier === 'FREE' && hasOneFreeConversion === false ? (
							<Button
								size='lg'
								onClick={handleConvert}
								disabled={isLoading}
								className='w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
							>
								Выбрать тариф
							</Button>
						) : (
							<Button
								size='lg'
								onClick={handleConvert}
								disabled={isLoading}
								className='w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
							>
								{isLoading ? 'Обработка...' : 'Получить клипы'}
								{!isLoading && !(tier === 'FREE' && hasOneFreeConversion === false) && (
									<ArrowRight className='ml-2 h-5 w-5' />
								)}
							</Button>
						)}
					</div>
				</div>
			</div>

			{!isAuthenticated ? (
				<p className='text-center text-lg text-muted-foreground mt-4 max-w-3xl mx-auto'>
					Вы не вошли в систему. Войдите в аккаунт и выберите тариф на странице цен.
				</p>
			) : tier === 'FREE' && hasOneFreeConversion === false ? (
				<p className='text-center text-lg text-muted-foreground mt-4 max-w-3xl mx-auto'>
					Вы использовали бесплатную конверсию. Разблокируйте больше возможностей, выбрав тариф на странице цен.
				</p>
			) : null}

			{/* Модальное окно загрузки */}
			<Dialog open={isLoading}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Генерация клипов</DialogTitle>
						<DialogDescription>
							Пожалуйста, подождите, пока мы обрабатываем ваше видео. Примерное время: {estimatedTime}
						</DialogDescription>
					</DialogHeader>
					<CustomProgress value={progress} className='w-full' />
				</DialogContent>
			</Dialog>

			<ClipResults clips={clips} />
		</div>
	)
}