import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dna, TrendingUp, Calendar } from "lucide-react"
import { getCulturalDNA } from "@/lib/cultural-analysis"

interface CulturalDNAProps {
  userId: string
}

export async function CulturalDNAAnalyzer({ userId }: CulturalDNAProps) {
  const culturalDNA = await getCulturalDNA(userId)

  return (
    <div className="space-y-6">
      {/* DNA Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Dna className="w-5 h-5 text-purple-400" />
            <span>Your Cultural DNA</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Deep analysis of your taste patterns and cultural preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Taste Dimensions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white mb-3">Taste Dimensions</h3>
              {culturalDNA.dimensions.map((dimension) => (
                <div key={dimension.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">{dimension.name}</span>
                    <span className="text-sm text-slate-400">{Math.round(dimension.score * 100)}%</span>
                  </div>
                  <Progress value={dimension.score * 100} className="h-2" />
                </div>
              ))}
            </div>

            {/* Cultural Markers */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white mb-3">Cultural Markers</h3>
              <div className="flex flex-wrap gap-2">
                {culturalDNA.markers.map((marker) => (
                  <Badge
                    key={marker.name}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 bg-purple-500/10"
                  >
                    {marker.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taste Evolution */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>Taste Evolution</span>
          </CardTitle>
          <CardDescription className="text-slate-400">How your preferences have changed over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {culturalDNA.evolution.map((period) => (
              <div key={period.period} className="flex items-center space-x-4 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{period.period}</h4>
                  <p className="text-sm text-slate-400">{period.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {period.genres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
