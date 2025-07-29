import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock, TrendingUp, Shuffle, Dna, Users } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">unv3iled</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/predictions"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Predictions</span>
              </Link>
              <Link
                href="/dna"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <Dna className="w-4 h-4" />
                <span>DNA</span>
              </Link>
              <div className="flex items-center space-x-2 text-slate-500 cursor-not-allowed">
                <Users className="w-4 h-4" />
                <span>Social</span>
                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-400">
                  Soon
                </Badge>
              </div>
              <Link
                href="/time-machine"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Time Machine</span>
              </Link>
              <Link
                href="/lucky"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                <span>Lucky</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/connect">
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 bg-transparent">
                Connect Platforms
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  )
}
