"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Message } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatInterfaceProps {
  messages: Message[]
  customerName: string
  onSendMessage: (message: Message) => void
}

export function ChatInterface({ messages, customerName, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage({
        id: Date.now().toString(),
        sender: "agent",
        content: inputValue,
        timestamp: new Date().toISOString(),
      })
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b bg-muted/30 flex items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={customerName} />
            <AvatarFallback>
              {customerName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{customerName}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "agent" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t flex gap-2 bg-background">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem..."
          className="flex-1"
        />
        <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
