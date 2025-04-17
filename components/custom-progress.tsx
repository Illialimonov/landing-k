'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CustomProgressProps extends HTMLAttributes<HTMLDivElement> {
	value: number
}

export function CustomProgress({
	value,
	className,
	...props
}: CustomProgressProps) {
	// Ограничиваем value в диапазоне 0–100
	const clampedValue = Math.min(Math.max(value, 0), 100)

	return (
		<div className={cn('relative w-full', className)} {...props}>
			<div className='w-full bg-gray-700 rounded-full h-4'>
				<div
					className='bg-primary h-4 rounded-full transition-all duration-300'
					style={{ width: `${clampedValue}%` }}
				/>
			</div>
			<span className='absolute -top-2 left-1/2 text-xs text-white mt-2'>
				{Math.round(clampedValue)}%
			</span>
		</div>
	)
}
