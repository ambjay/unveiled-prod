import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Music, Youtube, Gamepad2, Twitter, Plus, Check } from "lucide-react"
import { getPlatformConnections } from "@/lib/database"

interface PlatformConnectionsProps {
  userId: string
}

export async function PlatformConnections({ userId }: PlatformConnectionsProps) {
  const connections = await getPlatformConnections(userId)
  const connectedPlatforms = new Set(connections.map((conn: any) => conn.platform_name))

  const platforms = [
    {
      name: "spotify",
      displayName: "Spotify",
      description: "Music streaming and listening history",
      icon: Music,
      color: "text-green-400",
      connected: connectedPlatforms.has("spotify"),
    },
    {
      name: "youtube",
      displayName: "YouTube",
      description: "Video consumption and engagement patterns",
      icon: Youtube,
      color: "text-red-400",
      connected: connectedPlatforms.has("youtube"),
    },
    {
      name: "steam",
      displayName: "Steam",
      description: "Gaming preferences and playtime data",
      icon: Gamepad2,
      color: "text-blue-400",
      connected: connectedPlatforms.has("steam"),
    },
    {
      name: "twitter",
      displayName: "Twitter/X",
      description: "Social media engagement and interests",
      icon: Twitter,
      color: "text-sky-400",
      connected: connectedPlatforms.has("twitter"),
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {platforms.map((platform) => (
        <Card key={platform.name} className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <platform.icon className={`w-8 h-8 ${platform.color}`} />
                <div>
                  <CardTitle className="text-white">{platform.displayName}</CardTitle>
                  <CardDescription className="text-slate-400">{platform.description}</CardDescription>
                </div>
              </div>
              <Badge
                variant={platform.connected ? "default" : "secondary"}
                className={platform.connected ? "bg-green-500/20 text-green-400" : "bg-slate-600 text-slate-300"}
              >
                {platform.connected ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </>
                ) : (
                  "Not Connected"
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {platform.connected ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Data is being synced and analyzed for taste predictions.</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 bg-transparent hover:bg-red-500/10"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">
                  Connect your {platform.displayName} account to improve prediction accuracy.
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Connect {platform.displayName}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
