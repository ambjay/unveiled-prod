"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Twitter, Facebook, MessageSquare } from "lucide-react"

interface TasteSharingProps {
  userId: string
}

export function TasteSharing({ userId }: TasteSharingProps) {
  const [shareUrl, setShareUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateShareableProfile = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/share/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await response.json()
      setShareUrl(data.shareUrl)
    } catch (error) {
      console.error("Error generating shareable profile:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
  }

  const shareToSocial = (platform: string) => {
    const text = "Check out my taste DNA on unv3iled! 🎵🎮📺"
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    }
    window.open(urls[platform as keyof typeof urls], "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Share Profile */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            <span>Share Your Taste Profile</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Create a shareable link to your cultural DNA and predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!shareUrl ? (
            <Button
              onClick={generateShareableProfile}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isGenerating ? "Generating..." : "Generate Shareable Profile"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input value={shareUrl} readOnly className="bg-slate-900 border-slate-600 text-slate-300" />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-slate-600 text-slate-300 bg-transparent"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => shareToSocial("twitter")} size="sm" className="bg-blue-500 hover:bg-blue-600">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button onClick={() => shareToSocial("facebook")} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Taste Challenges */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            <span>Taste Challenges</span>
          </CardTitle>
          <CardDescription className="text-slate-400">Challenge friends to predict your taste</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <h4 className="font-medium text-white mb-2">Weekly Taste Challenge</h4>
              <p className="text-sm text-slate-400 mb-3">
                Can your friends predict what you'll rate this week's trending content?
              </p>
              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                Create Challenge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
