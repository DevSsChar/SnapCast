'use client'
import { incrementVideoViews } from '@/lib/actions/video'
import { useEffect, useRef } from 'react'

const VideoViewTracker = ({ videoId }: { videoId: string }) => {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Only track view once per session
    if (!hasTracked.current) {
      hasTracked.current = true
      
      // Wait 3 seconds before counting view (ensures user is actually watching)
      const timeout = setTimeout(() => {
        incrementVideoViews(videoId).catch(console.error)
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [videoId])

  return null
}

export default VideoViewTracker
