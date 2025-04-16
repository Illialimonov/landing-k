import { useToast } from '@/hooks/use-toast'
import { Copy, Download } from 'lucide-react'
import { Button } from './ui/button'
import { Clip } from '@/types'

interface ClipResultsProps {
	clips: Clip[]
}

export function ClipResults({ clips }: ClipResultsProps) {
	const { toast } = useToast()

	const handleCopyLink = (link: string) => {
		navigator.clipboard.writeText(link)
		toast({
			title: 'Copied!',
			description: 'Link copied to clipboard.',
		})
	}

	const handleDownload = (link: string) => {
		window.open(link, '_blank')

		if (!clips || clips.length === 0) return null
	}

	return (
		<div className='mt-8 max-w-3xl mx-auto'>
			<h2 className='text-2xl font-semibold text-white mb-4'>
				Generated Clips
			</h2>
			<div className='grid gap-4'>
				{clips.map((clip, index) => (
					<div
						key={index}
						className='bg-secondary/50 rounded-lg p-4 border border-muted-foreground/20'
					>
						<h3 className='text-lg font-medium text-white'>{clip.videoName}</h3>
						<p className='text-muted-foreground mt-1'>
							Duration: {clip.length}
						</p>
						<div className='mt-2 flex flex-wrap gap-2'>
							{clip.hashtags.map((hashtag, idx) => (
								<span
									key={idx}
									className='text-sm text-primary bg-primary/10 rounded-full px-2 py-1'
								>
									#{hashtag}
								</span>
							))}
						</div>
						<div className='mt-4 flex gap-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handleCopyLink(clip.link)}
								className='flex items-center gap-2'
							>
								<Copy className='h-4 w-4' />
								Copy Link
							</Button>
							<Button
								size='sm'
								onClick={() => handleDownload(clip.link)}
								className='flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
							>
								<Download className='h-4 w-4' />
								Download
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
