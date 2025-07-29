import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface DiscoveryFeedProps {
  userId: string
}

export async function DiscoveryFeed({ userId }: DiscoveryFeedProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span>Discovery Feed</span>
        </CardTitle>
        <CardDescription className="text-slate-400">Daily insights and mini-predictions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-slate-400">
          <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Your personalized insights will appear here</p>
        </div>
      </CardContent>
    </Card>
  )
}
