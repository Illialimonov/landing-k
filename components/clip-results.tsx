'use client'

import { useToast } from '@/hooks/use-toast'
import { Copy, Download } from 'lucide-react'
import { Button } from './ui/button'
import { Clip } from '@/types'
import { useState, useRef } from 'react'
import { Loader } from './ui/loader'

interface ClipResultsProps {
  clips: Clip[]
}

export function ClipResults({ clips }: ClipResultsProps) {
  const { toast } = useToast()
  const [loadedVideos, setLoadedVideos] = useState<boolean[]>(
    new Array(clips.length).fill(false)
  )
  const [errorVideos, setErrorVideos] = useState<boolean[]>(
    new Array(clips.length).fill(false)
  )
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(new Array(clips.length).fill(null))

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: 'Скопировано!',
      description: 'Ссылка скопирована в буфер обмена.',
    })
  }

  const handleDownload = (link: string) => {
    window.open(link, '_blank')
  }

  const handleVideoLoaded = (index: number) => {
    setLoadedVideos(prev => {
      const newLoaded = [...prev]
      newLoaded[index] = true
      return newLoaded
    })
    setErrorVideos(prev => {
      const newErrors = [...prev]
      newErrors[index] = false // Сбрасываем ошибку при успешной загрузке
      return newErrors
    })
  }

  const handleVideoError = (index: number) => {
    setLoadedVideos(prev => {
      const newLoaded = [...prev]
      newLoaded[index] = true // Скрываем лоадер, чтобы показать ошибку
      return newLoaded
    })
    setErrorVideos(prev => {
      const newErrors = [...prev]
      newErrors[index] = true
      return newErrors
    })
  }

  const retryLoad = (index: number) => {
    setErrorVideos(prev => {
      const newErrors = [...prev]
      newErrors[index] = false // Сбрасываем ошибку для повторной попытки
      return newErrors
    })
    setLoadedVideos(prev => {
      const newLoaded = [...prev]
      newLoaded[index] = false // Показываем лоадер снова
      return newLoaded
    })
    if (videoRefs.current[index]) {
      videoRefs.current[index]?.load() // Перезагружаем видео
    }
  }

  if (!clips || clips.length === 0) {
    return null
  }

  const gridColsClass =
    clips.length === 1
      ? 'grid-cols-1'
      : clips.length === 2
      ? 'grid-cols-2'
      : 'grid-cols-3'

  return (
    <div className='mt-8 max-w-7xl mx-auto px-4'>
      <h2 className='text-2xl md:text-3xl font-semibold text-white mb-6 text-center'>
        Сгенерированные клипы
      </h2>
      <div className={`grid ${gridColsClass} gap-4 md:gap-6`}>
        {clips.map((clip, index) => (
          <div
            key={index}
            className='bg-secondary/50 rounded-lg p-4 border border-muted-foreground/20 hover:shadow-lg transition-shadow duration-300'
          >
            {/* Видео */}
            <div className='relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-4'>
              {loadedVideos[index] ? (
                errorVideos[index] ? (
                  <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-red-500/30 text-white text-sm p-4'>
                    <p>Не удалось загрузить видео.</p>
                    <button
                      onClick={() => retryLoad(index)}
                      className='mt-2 px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary/80'
                    >
                      Повторить
                    </button>
                  </div>
                ) : (
                  <video
                    ref={el => (videoRefs.current[index] = el)}
                    src={clip.link}
                    controls
                    preload='metadata'
                    className='absolute top-0 left-0 w-full h-full object-cover'
                    onLoadedData={() => handleVideoLoaded(index)}
                    onError={() => handleVideoError(index)}
                  />
                )
              ) : (
                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-secondary'>
                  <Loader />
                </div>
              )}
              {!loadedVideos[index] && (
                <video
                  ref={el => (videoRefs.current[index] = el)}
                  src={clip.link}
                  className='hidden'
                  onLoadedData={() => handleVideoLoaded(index)}
                  onError={() => handleVideoError(index)}
                />
              )}
            </div>

            {/* Метаданные */}
            <h3 className='text-lg font-medium text-white truncate'>
              {clip.videoName}
            </h3>
            <p className='text-muted-foreground text-sm mt-1'>
              Длительность: {clip.length}
            </p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {clip.hashtags.map((hashtag, idx) => (
                <span
                  key={idx}
                  className='text-sm text-primary bg-primary/10 rounded-full px-2 py-1'
                >
                  {hashtag}
                </span>
              ))}
            </div>

            {/* Кнопки */}
            <div className='mt-4 flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleCopyLink(clip.link)}
                className='flex items-center gap-2'
              >
                <Copy className='h-4 w-4' />
                Скопировать ссылку
              </Button>
              <Button
                size='sm'
                onClick={() => handleDownload(clip.link)}
                className='flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              >
                <Download className='h-4 w-4' />
                Скачать
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}