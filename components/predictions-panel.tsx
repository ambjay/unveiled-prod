import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Heart, Share2, Clock } from "lucide-react"
import { getPredictions } from "@/lib/qloo-service"

interface PredictionsPanelProps {
  userId: string
}

export async function PredictionsPanel({ userId }: PredictionsPanelProps) {
  const predictions = await getPredictions(userId)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span>Future Predictions</span>
            </CardTitle>
            <CardDescription className="text-slate-400">What you'll love before you know you love it</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            {predictions.length} predictions
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{prediction.entity_name}</h3>
                  <p className="text-sm text-slate-400 mb-2">{prediction.entity_type}</p>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        prediction.confidence_score >= 0.8
                          ? "border-green-500 text-green-400"
                          : prediction.confidence_score >= 0.6
                            ? "border-yellow-500 text-yellow-400"
                            : "border-red-500 text-red-400"
                      }`}
                    >
                      {Math.round(prediction.confidence_score * 100)}% confidence
                    </Badge>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {prediction.predicted_timeframe}
                    </div>
                  </div>
                </div>
              </div>

              {prediction.reasoning && (
                <p className="text-sm text-slate-300 mb-3 line-clamp-2">{prediction.reasoning}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                  Explore
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
