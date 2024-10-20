'use client'

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CallWebSocket({ listenUrl }: { listenUrl: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState('')

  useEffect(() => {
    const ws = new WebSocket(listenUrl)

    ws.onopen = () => {
      console.log('Connected to WebSocket')
    }

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data])
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('Disconnected from WebSocket')
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [listenUrl])

  const sendMessage = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(inputMessage)
      setInputMessage('')
    }
  }, [socket, inputMessage])

  return (
    <>
      <div className="h-60 overflow-y-auto border rounded p-2">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <div className="flex space-x-2 mt-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </>
  )
}