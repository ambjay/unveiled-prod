"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Music, Youtube, Gamepad2, Twitter, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface PlatformOAuthProps {
  userId: string
}

interface Platform {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  description: string
  dataTypes: string[]
  connected: boolean
  syncing: boolean
  lastSync?: string
  dataCount?: number
}

export function PlatformOAuth({ userId }: PlatformOAuthProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "spotify",
      name: "Spotify",
      icon: Music,
      color: "text-green-400",
      description: "Music streaming and listening history",
      dataTypes: ["Listening History", "Playlists", "Saved Tracks", "Artists"],
      connected: false,
      syncing: false,
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-red-400",
      description: "Video consumption and engagement patterns",
      dataTypes: ["Watch History", "Liked Videos", "Subscriptions", "Comments"],
      connected: false,
      syncing: false,
    },
    {
      id: "steam",
      name: "Steam",
      icon: Gamepad2,
      color: "text-blue-400",
      description: "Gaming preferences and playtime data",
      dataTypes: ["Game Library", "Playtime", "Achievements", "Reviews"],
      connected: false,
      syncing: false,
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: Twitter,
      color: "text-sky-400",
      description: "Social media engagement and interests",
      dataTypes: ["Tweets", "Likes", "Follows", "Lists"],
      connected: false,
      syncing: false,
    },
  ])

  const connectPlatform = async (platformId: string) => {
    setPlatforms((prev) => prev.map((p) => (p.id === platformId ? { ...p, syncing: true } : p)))

    try {
      // Simulate OAuth flow
      const response = await fetch(`/api/oauth/${platformId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        const data = await response.json()

        setPlatforms((prev) =>
          prev.map((p) =>
            p.id === platformId
              ? {
                  ...p,
                  connected: true,
                  syncing: false,
                  lastSync: new Date().toISOString(),
                  dataCount: data.dataCount || 0,
                }
              : p,
          ),
        )
      }
    } catch (error) {
      console.error(`Error connecting ${platformId}:`, error)
      setPlatforms((prev) => prev.map((p) => (p.id === platformId ? { ...p, syncing: false } : p)))
    }
  }

  const disconnectPlatform = async (platformId: string) => {
    try {
      await fetch(`/api/oauth/${platformId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === platformId ? { ...p, connected: false, lastSync: undefined, dataCount: undefined } : p,
        ),
      )
    } catch (error) {
      console.error(`Error disconnecting ${platformId}:`, error)
    }
  }

  const connectedCount = platforms.filter((p) => p.connected).length
  const totalDataPoints = platforms.reduce((sum, p) => sum + (p.dataCount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Connection Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Platform Integration Status</CardTitle>
          <CardDescription className="text-slate-400">
            Connect your platforms to enhance taste predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">{connectedCount}/4</div>
              <div className="text-sm text-slate-400">Platforms Connected</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">{totalDataPoints.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Data Points</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">{Math.round((connectedCount / 4) * 100)}%</div>
              <div className="text-sm text-slate-400">Profile Complete</div>
            </div>
          </div>
          <Progress value={(connectedCount / 4) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Platform Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {platforms.map((platform) => (
          <Card key={platform.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <platform.icon className={`w-8 h-8 ${platform.color}`} />
                  <div>
                    <CardTitle className="text-white">{platform.name}</CardTitle>
                    <CardDescription className="text-slate-400">{platform.description}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={platform.connected ? "default" : "secondary"}
                  className={platform.connected ? "bg-green-500/20 text-green-400" : "bg-slate-600 text-slate-300"}
                >
                  {platform.syncing ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Syncing
                    </>
                  ) : platform.connected ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </>
                  ) : (
                    "Not Connected"
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Data Types */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Data We'll Analyze:</h4>
                  <div className="flex flex-wrap gap-1">
                    {platform.dataTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Connection Status */}
                {platform.connected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Last Sync:</span>
                      <span className="text-slate-300">
                        {platform.lastSync ? new Date(platform.lastSync).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Data Points:</span>
                      <span className="text-slate-300">{platform.dataCount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 bg-transparent"
                        onClick={() => connectPlatform(platform.id)}
                        disabled={platform.syncing}
                      >
                        {platform.syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Sync Now"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 bg-transparent hover:bg-red-500/10"
                        onClick={() => disconnectPlatform(platform.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Connect to improve prediction accuracy</span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={() => connectPlatform(platform.id)}
                      disabled={platform.syncing}
                    >
                      {platform.syncing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        `Connect ${platform.name}`
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
