import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Target, Zap, Star } from "lucide-react"
import { getAdvancedPredictions } from "@/lib/advanced-predictions"

interface AdvancedPredictionsProps {
  userId: string
}

export async function AdvancedPredictions({ userId }: AdvancedPredictionsProps) {
  const predictions = await getAdvancedPredictions(userId)

  return (
    <div className="space-y-6">
      {/* Prediction Accuracy */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-400" />
            <span>Prediction Accuracy</span>
          </CardTitle>
          <CardDescription className="text-slate-400">How accurate our predictions have been for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">{predictions.accuracy.overall}%</div>
              <div className="text-sm text-slate-400">Overall Accuracy</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">{predictions.accuracy.music}%</div>
              <div className="text-sm text-slate-400">Music Predictions</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">{predictions.accuracy.content}%</div>
              <div className="text-sm text-slate-400">Content Predictions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Micro-Predictions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Micro-Predictions</span>
          </CardTitle>
          <CardDescription className="text-slate-400">Quick predictions for immediate content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.microPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{prediction.title}</h4>
                  <p className="text-sm text-slate-400">{prediction.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                      {prediction.timeframe}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-slate-400">{prediction.confidence}% likely</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                  Track
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Predictions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span>Seasonal Taste Patterns</span>
          </CardTitle>
          <CardDescription className="text-slate-400">How your taste changes throughout the year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.seasonalPatterns.map((season) => (
              <div key={season.season} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">{season.season}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {season.strength}% influence
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 mb-3">{season.description}</p>
                <div className="flex flex-wrap gap-2">
                  {season.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
