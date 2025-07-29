import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, UserPlus } from "lucide-react"
import { getSocialTasteNetwork } from "@/lib/social-analysis"

interface SocialTasteNetworkProps {
  userId: string
}

export async function SocialTasteNetwork({ userId }: SocialTasteNetworkProps) {
  const network = await getSocialTasteNetwork(userId)

  return (
    <div className="space-y-6">
      {/* Taste Compatibility */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Taste Compatibility</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Find people with similar or complementary taste profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {network.compatibleUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{user.name}</h4>
                    <p className="text-sm text-slate-400">{user.compatibility}% taste match</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    {user.sharedInterests} shared
                  </Badge>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Taste Communities */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-green-400" />
            <span>Taste Communities</span>
          </CardTitle>
          <CardDescription className="text-slate-400">Communities that match your cultural interests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {network.communities.map((community) => (
              <div key={community.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">{community.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {community.members} members
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 mb-3">{community.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {community.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
