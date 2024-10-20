'use client'

import { useState, useEffect, useRef } from 'react'

interface AudioStreamPlayerProps {
  listenUrl: string;
}
export default function AudioStreamPlayer({ listenUrl }: AudioStreamPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [volume, setVolume] = useState(1)
  const socketRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket(listenUrl)

    socketRef.current.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    // Initialize Audio Context
    audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.connect(audioContextRef.current.destination)

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!socketRef.current) return

    socketRef.current.onmessage = async (event) => {
      if (!(event.data instanceof Blob)) {
        console.error('Received data is not a Blob')
        return
      }

      const arrayBuffer = await event.data.arrayBuffer()
      const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer)

      if (isPlaying) {
        playAudioBuffer(audioBuffer)
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current!.currentTime)
    }
  }, [volume])

  const playAudioBuffer = (audioBuffer: AudioBuffer) => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop()
    }

    sourceNodeRef.current = audioContextRef.current!.createBufferSource()
    sourceNodeRef.current.buffer = audioBuffer
    sourceNodeRef.current.connect(gainNodeRef.current!)
    sourceNodeRef.current.start(0)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      // Resume audio context if it was suspended
      audioContextRef.current!.resume()
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Audio Stream Player</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Connection Status:</span>
          <span className={`font-semibold ${isConnected ? "text-green-500" : "text-red-500"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <button 
          onClick={togglePlayback} 
          disabled={!isConnected}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
            isConnected 
              ? (isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600") 
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div className="space-y-2">
          <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
            Volume
          </label>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}