"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Play, Pause, Volume2, Settings } from "lucide-react"
import { POPULAR_VOICES } from "@/lib/elevenlabs-service"

interface Voice {
  voice_id: string
  name: string
  category: string
  description?: string
}

export function VoiceSetup() {
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentVoiceId, setCurrentVoiceId] = useState<string>("")

  useEffect(() => {
    fetchVoices()
    setCurrentVoiceId(process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || "")
  }, [])

  const fetchVoices = async () => {
    try {
      const response = await fetch("/api/voice/list")
      if (response.ok) {
        const data = await response.json()
        setVoices(data.voices || [])
      }
    } catch (error) {
      console.error("Error fetching voices:", error)
    }
  }

  const testVoice = async (voiceId: string) => {
    setIsLoading(true)
    setIsPlaying(true)

    try {
      const response = await fetch("/api/voice/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceId,
          text: "Hi! I'm Geoffrey, your taste AI companion. I can help you discover amazing content based on your cultural DNA.",
        }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        audio.onended = () => setIsPlaying(false)
        audio.onerror = () => setIsPlaying(false)

        await audio.play()
      }
    } catch (error) {
      console.error("Error testing voice:", error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }

  const saveVoiceSelection = async () => {
    if (!selectedVoice) return

    try {
      const response = await fetch("/api/voice/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId: selectedVoice }),
      })

      if (response.ok) {
        setCurrentVoiceId(selectedVoice)
        // You'd typically update environment variables or user settings here
      }
    } catch (error) {
      console.error("Error saving voice selection:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Voice Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-purple-400" />
            <span>Geoffrey's Voice Configuration</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Choose Geoffrey's voice for the ultimate AI assistant experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div>
              <h4 className="font-medium text-white">Current Voice</h4>
              <p className="text-sm text-slate-400">
                {currentVoiceId ? `Voice ID: ${currentVoiceId}` : "No voice configured"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={currentVoiceId ? "default" : "secondary"}>
                {currentVoiceId ? "Configured" : "Not Set"}
              </Badge>
              {currentVoiceId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testVoice(currentVoiceId)}
                  disabled={isLoading}
                  className="border-slate-600 text-slate-300 bg-transparent"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-green-400" />
            <span>Choose Geoffrey's Voice</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Select from popular voices or use a custom voice ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Popular Voices */}
          <div>
            <h4 className="font-medium text-white mb-3">Popular Voices</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(POPULAR_VOICES).map(([name, voiceId]) => (
                <div
                  key={voiceId}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                >
                  <div>
                    <h5 className="font-medium text-white">{name}</h5>
                    <p className="text-xs text-slate-400">{voiceId}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testVoice(voiceId)}
                      disabled={isLoading}
                      className="border-slate-600 text-slate-300 bg-transparent"
                    >
                      {isLoading && selectedVoice === voiceId ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSelectedVoice(voiceId)}
                      className={
                        selectedVoice === voiceId
                          ? "bg-purple-500 hover:bg-purple-600"
                          : "bg-slate-700 hover:bg-slate-600"
                      }
                    >
                      {selectedVoice === voiceId ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Voice ID */}
          <div>
            <h4 className="font-medium text-white mb-3">Custom Voice ID</h4>
            <div className="flex space-x-2">
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="flex-1 bg-slate-900 border-slate-600 text-slate-300">
                  <SelectValue placeholder="Enter custom voice ID or select above" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                      {voice.name} ({voice.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedVoice && (
                <Button
                  onClick={() => testVoice(selectedVoice)}
                  disabled={isLoading}
                  variant="outline"
                  className="border-slate-600 text-slate-300 bg-transparent"
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Save Button */}
          {selectedVoice && selectedVoice !== currentVoiceId && (
            <Button
              onClick={saveVoiceSelection}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Mic className="w-4 h-4 mr-2" />
              Set as Geoffrey's Voice
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Voice Setup Instructions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Voice Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
            <h4 className="font-medium text-white mb-2">Environment Variable</h4>
            <p className="text-sm text-slate-400 mb-2">Add this to your .env.local file:</p>
            <code className="text-sm text-green-400 bg-slate-800 p-2 rounded block">
              ELEVENLABS_VOICE_ID={selectedVoice || "your_voice_id_here"}
            </code>
          </div>
          <div className="text-sm text-slate-400">
            <p>
              <strong>Tip:</strong> You can clone your own voice or use any voice from your ElevenLabs account. Just
              copy the voice ID from your ElevenLabs dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
