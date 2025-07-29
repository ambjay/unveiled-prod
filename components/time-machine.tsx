"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Music, Tv, Gamepad2 } from "lucide-react"

interface TimeMachineProps {
  userId: string
}

const eras = [
  { id: "1960s", name: "Swinging Sixties", icon: "🎭", description: "Rock revolution and cultural explosion" },
  { id: "1970s", name: "Groovy Seventies", icon: "🕺", description: "Disco, punk, and progressive sounds" },
  { id: "1980s", name: "Electric Eighties", icon: "⚡", description: "Synth-pop and MTV generation" },
  { id: "1990s", name: "Alternative Nineties", icon: "🎸", description: "Grunge, hip-hop, and indie culture" },
  { id: "2000s", name: "Digital Aughts", icon: "💿", description: "MP3s, reality TV, and social media dawn" },
  { id: "2010s", name: "Streaming Teens", icon: "📱", description: "Apps, viral content, and playlist culture" },
]

export function TimeMachine({ userId }: TimeMachineProps) {
  const [selectedEra, setSelectedEra] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateEraProfile = async (eraId: string) => {
    setIsGenerating(true)
    setSelectedEra(eraId)

    // Simulate API call to generate era-specific taste profile
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="space-y-8">
      {/* Era Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>Choose Your Era</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Select a time period to see how your taste would have developed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eras.map((era) => (
              <Button
                key={era.id}
                variant="outline"
                className={`h-auto p-4 border-slate-600 bg-slate-900/50 hover:bg-slate-800 text-left flex flex-col items-start space-y-2 ${
                  selectedEra === era.id ? "border-purple-500 bg-purple-500/10" : ""
                }`}
                onClick={() => generateEraProfile(era.id)}
                disabled={isGenerating}
              >
                <div className="flex items-center space-x-2 w-full">
                  <span className="text-2xl">{era.icon}</span>
                  <span className="font-semibold text-white">{era.name}</span>
                </div>
                <p className="text-sm text-slate-400">{era.description}</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Era Analysis Results */}
      {selectedEra && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Your {eras.find((e) => e.id === selectedEra)?.name} Profile</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Based on your current taste DNA, here's how you might have experienced this era
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-400">Analyzing your taste through time...</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Music className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">Music</h3>
                  </div>
                  <div className="text-center py-8 text-slate-400">
                    <Music className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Your era-specific music taste will appear here</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Tv className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-white">Entertainment</h3>
                  </div>
                  <div className="text-center py-8 text-slate-400">
                    <Tv className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Era-appropriate shows and movies</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Gamepad2 className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Culture</h3>
                  </div>
                  <div className="text-center py-8 text-slate-400">
                    <Gamepad2 className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Cultural movements you'd follow</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
