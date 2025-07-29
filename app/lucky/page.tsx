"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Heart, Share2, RefreshCw, ExternalLink, Play } from "lucide-react"

interface Recommendation {
  id: string
  title: string
  type: string
  reasoning: string
  confidence: number
  platform: string
  preview_url?: string
  external_url?: string
  image_url?: string
}

export default function LuckyPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)

  const generateRecommendation = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/serendipity", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendation(data)
      }
    } catch (error) {
      console.error("Error generating recommendation:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">I'm Feeling Lucky</h1>
            <p className="text-slate-400">Let serendipity guide your next discovery</p>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center space-x-2">
                <Shuffle className="w-6 h-6 text-purple-400" />
                <span>Serendipity Engine</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Powered by your taste DNA and Qloo's cultural intelligence
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!recommendation ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shuffle className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-slate-300 mb-6">
                    Ready to discover something unexpected that perfectly matches your taste?
                  </p>
                  <Button
                    onClick={generateRecommendation}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Discovering...
                      </>
                    ) : (
                      <>
                        <Shuffle className="w-5 h-5 mr-2" />
                        I'm Feeling Lucky
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{recommendation.title}</h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="outline" className="border-purple-500 text-purple-400">
                            {recommendation.type}
                          </Badge>
                          <Badge variant="outline" className="border-blue-500 text-blue-400">
                            {recommendation.platform}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`${
                              recommendation.confidence >= 0.8
                                ? "border-green-500 text-green-400"
                                : recommendation.confidence >= 0.6
                                  ? "border-yellow-500 text-yellow-400"
                                  : "border-red-500 text-red-400"
                            }`}
                          >
                            {Math.round(recommendation.confidence * 100)}% match
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-4">{recommendation.reasoning}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {recommendation.preview_url && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          <Play className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      )}
                      {recommendation.external_url && (
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in {recommendation.platform}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                        <Heart className="w-4 h-4 mr-2" />
                        Love It
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={generateRecommendation}
                      disabled={isGenerating}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
