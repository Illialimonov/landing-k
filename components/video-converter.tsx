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

export function VideoConverter() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [filler, setFiller] = useState('random')

  const handleConvert = () => {
    // Will implement conversion logic later
    console.log('Converting:', { youtubeUrl, filler })
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75" />
      <div className="relative bg-background border rounded-lg p-2">
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            placeholder="Paste YouTube video URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="flex-1 text-lg py-6"
          />
          <Select value={filler} onValueChange={setFiller}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select filler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gta5">GTA 5</SelectItem>
              <SelectItem value="minecraft">Minecraft Parkour</SelectItem>
              <SelectItem value="press">Hydraulic Press</SelectItem>
              <SelectItem value="truck">Cluster Truck</SelectItem>
              <SelectItem value="steep">Steep</SelectItem>
              <SelectItem value="random">Random</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            size="lg" 
            onClick={handleConvert}
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Get Clips
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}