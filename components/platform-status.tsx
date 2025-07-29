import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus } from "lucide-react"

interface PlatformStatusProps {
  userId: string
}

export async function PlatformStatus({ userId }: PlatformStatusProps) {
  const platforms = [
    { name: "Spotify", connected: false, icon: "🎵" },
    { name: "YouTube", connected: false, icon: "📺" },
    { name: "Steam", connected: false, icon: "🎮" },
    { name: "Twitter/X", connected: false, icon: "🐦" },
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Settings className="w-5 h-5 text-green-400" />
          <span>Platform Status</span>
        </CardTitle>
        <CardDescription className="text-slate-400">Connect platforms to enhance predictions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{platform.icon}</span>
              <span className="text-white font-medium">{platform.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={platform.connected ? "default" : "secondary"}
                className={platform.connected ? "bg-green-500/20 text-green-400" : "bg-slate-600 text-slate-300"}
              >
                {platform.connected ? "Connected" : "Not Connected"}
              </Badge>
              {!platform.connected && (
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                  <Plus className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
