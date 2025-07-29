import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, MessageCircle, Shuffle, Clock, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">unv3iled</span>
            </div>
            <div className="flex items-center space-x-4">
              <SignInButton>
                <Button variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover What You'll{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Love</span>{" "}
            Before You Know It
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            unv3iled uses AI to analyze your cultural consumption patterns and predict your future taste with
            unprecedented accuracy. Meet Geoffrey, your personal taste AI companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Predicting Your Taste
              </Button>
            </SignUpButton>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 bg-transparent text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Future Predictions</CardTitle>
              <CardDescription className="text-slate-400">
                AI-powered predictions of music, games, videos, and content you'll love before you discover them
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <MessageCircle className="w-12 h-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Geoffrey AI Assistant</CardTitle>
              <CardDescription className="text-slate-400">
                Your personal taste companion who knows your cultural DNA and helps you discover new content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Shuffle className="w-12 h-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Serendipity Engine</CardTitle>
              <CardDescription className="text-slate-400">
                Discover unexpected content that perfectly matches your taste through AI-powered serendipity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Clock className="w-12 h-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Time Machine</CardTitle>
              <CardDescription className="text-slate-400">
                Explore how your taste would have evolved in different eras and cultural movements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Users className="w-12 h-12 text-red-400 mb-4" />
              <CardTitle className="text-white">Platform Integration</CardTitle>
              <CardDescription className="text-slate-400">
                Connect Spotify, YouTube, Steam, Twitter/X to build your comprehensive taste profile
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Sparkles className="w-12 h-12 text-pink-400 mb-4" />
              <CardTitle className="text-white">Taste DNA Analysis</CardTitle>
              <CardDescription className="text-slate-400">
                Deep analysis of your cultural influences and taste evolution patterns over time
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-slate-800/30 rounded-2xl p-12 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Unveil Your Future Taste?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already discovering their next favorite content before it goes mainstream.
          </p>
          <SignUpButton>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
            >
              Get Started Free
            </Button>
          </SignUpButton>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">unv3iled</span>
            </div>
            <p className="text-slate-400 text-sm">© 2024 unv3iled. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
