"use client"

import { useState, useRef } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mic, MicOff, Send, Minimize2, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface GeoffreyAssistantProps {
  userId: string
}

export function GeoffreyAssistant({ userId }: GeoffreyAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/geoffrey",
    body: { userId },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hey! I'm Geoffrey, your taste AI companion. I know your cultural DNA inside and out. What would you like to discover today?",
      },
    ],
    onFinish: async (message) => {
      // Generate voice for Geoffrey's responses if voice is enabled
      if (voiceEnabled && message.role === "assistant") {
        try {
          const response = await fetch("/api/voice/geoffrey", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message.content }),
          })

          if (response.ok) {
            const audioBlob = await response.blob()
            const audioUrl = URL.createObjectURL(audioBlob)
            if (audioRef.current) {
              audioRef.current.src = audioUrl
              audioRef.current.play()
            }
          }
        } catch (error) {
          console.error("Error generating voice:", error)
        }
      }
    },
  })

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode)
    if (isListening) {
      setIsListening(false)
    }
  }

  const toggleVoicePlayback = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  const startListening = () => {
    setIsListening(true)
    // Voice recording logic would go here
    // For now, just simulate
    setTimeout(() => {
      setIsListening(false)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
    // Stop recording and process speech
  }

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        {messages.length > 1 && (
          <Badge className="absolute -top-2 -left-2 bg-red-500 text-white">{messages.length - 1}</Badge>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-white text-lg">Geoffrey</CardTitle>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                Online
              </Badge>
              {process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                  Voice
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleVoicePlayback}
                  className={cn("text-slate-400 hover:text-white", voiceEnabled && "text-blue-400")}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleVoiceMode}
                className={cn("text-slate-400 hover:text-white", isVoiceMode && "text-purple-400")}
              >
                {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="h-80 overflow-y-auto space-y-3 pr-2">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-purple-500 text-white"
                      : "bg-slate-800 text-slate-200 border border-slate-700",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            {isVoiceMode ? (
              <Button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  "flex-1",
                  isListening ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600",
                )}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isListening ? "Stop Recording" : "Start Recording"}
              </Button>
            ) : (
              <>
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask Geoffrey about your taste..."
                  className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Hidden audio element for voice playback */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlayingVoice(true)}
        onEnded={() => setIsPlayingVoice(false)}
        onError={() => setIsPlayingVoice(false)}
      />
    </div>
  )
}
