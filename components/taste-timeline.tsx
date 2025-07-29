import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimerIcon as Timeline, Clock } from "lucide-react"

interface TasteTimelineProps {
  userId: string
}

export async function TasteTimeline({ userId }: TasteTimelineProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Timeline className="w-5 h-5 text-blue-400" />
          <span>Taste Evolution Timeline</span>
        </CardTitle>
        <CardDescription className="text-slate-400">Your cultural journey mapped over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-slate-400">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Connect your platforms to see your taste evolution</p>
        </div>
      </CardContent>
    </Card>
  )
}
