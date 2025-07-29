"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ExternalLink, Copy, Brain, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SetupItem {
  name: string
  description: string
  required: boolean
  configured: boolean
  envVar: string
  setupUrl?: string
  icon?: React.ComponentType<any>
  additionalInfo?: string
}

export function SetupGuide() {
  const setupItems: SetupItem[] = [
    {
      name: "Clerk Authentication",
      description: "User authentication and management",
      required: true,
      configured: !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY),
      envVar: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY",
      setupUrl: "https://dashboard.clerk.com/last-active?path=api-keys",
    },
    {
      name: "Supabase Database",
      description: "PostgreSQL database with real-time features",
      required: true,
      configured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      envVar: "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY",
      setupUrl: "https://supabase.com/dashboard",
    },
    {
      name: "Groq AI",
      description: "Fast AI responses for Geoffrey assistant",
      required: true,
      configured: !!process.env.GROQ_API_KEY,
      envVar: "GROQ_API_KEY",
      setupUrl: "https://console.groq.com/keys",
    },
    {
      name: "Qloo Taste Intelligence",
      description: "Core taste prediction and cultural intelligence engine",
      required: true,
      configured: !!(process.env.QLOO_API_KEY && process.env.QLOO_API_URL),
      envVar: "QLOO_API_KEY, QLOO_API_URL",
      setupUrl: "https://qloo.com/contact",
      icon: Brain,
    },
    {
      name: "ElevenLabs Voice",
      description: "Voice synthesis for Geoffrey AI assistant",
      required: false,
      configured: !!(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID),
      envVar: "ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID",
      setupUrl: "https://elevenlabs.io/",
      icon: Mic,
      additionalInfo: "Voice ID required - choose from popular voices or clone your own",
    },
    {
      name: "Spotify Integration",
      description: "Music streaming data for taste analysis",
      required: false,
      configured: !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET),
      envVar: "SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET",
      setupUrl: "https://developer.spotify.com/dashboard",
    },
    {
      name: "YouTube Integration",
      description: "Video consumption patterns",
      required: false,
      configured: !!process.env.YOUTUBE_API_KEY,
      envVar: "YOUTUBE_API_KEY",
      setupUrl: "https://console.developers.google.com/",
    },
    {
      name: "Twitter/X Integration",
      description: "Social media engagement data",
      required: false,
      configured: !!(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET),
      envVar: "TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET",
      setupUrl: "https://developer.twitter.com/en/portal/dashboard",
    },
  ]

  const allRequired = setupItems.filter((item) => item.required).every((item) => item.configured)
  const optionalConfigured = setupItems.filter((item) => !item.required && item.configured).length
  const totalOptional = setupItems.filter((item) => !item.required).length

  const copyEnvTemplate = () => {
    const template = `# ===================================
# REQUIRED - Core Platform
# ===================================

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Groq AI (Geoffrey assistant)
GROQ_API_KEY=gsk_...

# Qloo Taste Intelligence (CORE ENGINE)
QLOO_API_KEY=your_qloo_api_key
QLOO_API_URL=https://api.qloo.com/v1

# ===================================
# OPTIONAL - Enhanced Features
# ===================================

# ElevenLabs Voice (Geoffrey voice synthesis)
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Popular Voice IDs (choose one):
# ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB  # Adam (deep, authoritative)
# ELEVENLABS_VOICE_ID=ErXwobaYiN019PkySvjV  # Antoni (well-balanced)
# ELEVENLABS_VOICE_ID=TxGEqnHWrfWFTfGW9XjX  # Josh (light, friendly)
# ELEVENLABS_VOICE_ID=yoZ06aMxZJJ28mfd3POQ  # Sam (casual, conversational)

# Platform Integrations
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
YOUTUBE_API_KEY=...
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
STEAM_API_KEY=...`

    navigator.clipboard.writeText(template)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to unv3iled</h1>
          <p className="text-xl text-slate-300 mb-6">Let's get your AI taste prediction platform set up!</p>
          <div className="flex justify-center space-x-4">
            <Badge variant={allRequired ? "default" : "secondary"} className="text-lg px-4 py-2">
              {allRequired ? "✅ Core Ready" : "⚙️ Setup Required"}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 border-blue-500 text-blue-400">
              {optionalConfigured}/{totalOptional} Integrations
            </Badge>
          </div>
        </div>

        {/* Update the Qloo section to be more prominent */}
        {!setupItems.find((item) => item.name === "Qloo Taste Intelligence")?.configured && (
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-purple-400" />
                <div>
                  <CardTitle className="text-white text-xl">⚠️ Qloo Required - Core Engine Missing</CardTitle>
                  <CardDescription className="text-slate-300">
                    Qloo powers ALL taste predictions and cultural intelligence. Without Qloo, unv3iled cannot function.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded mb-4">
                <h4 className="text-red-400 font-medium mb-2">What Qloo Powers:</h4>
                <ul className="text-sm text-red-300 space-y-1">
                  <li>• Future taste predictions ("what you'll love before you know it")</li>
                  <li>• Cultural DNA analysis and taste evolution tracking</li>
                  <li>• Influence mapping and taste relationship analysis</li>
                  <li>• Time machine historical projections</li>
                  <li>• Serendipity engine for unexpected discoveries</li>
                  <li>• Geoffrey's taste intelligence (Groq just provides conversation)</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600 mb-4">
                <p className="text-sm text-slate-400 mb-2">Contact Qloo for API access:</p>
                <div className="flex items-center space-x-4">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <a href="https://qloo.com/contact" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Contact Qloo (Required)
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                    <a href="https://qloo.com/developers" target="_blank" rel="noopener noreferrer">
                      View API Docs
                    </a>
                  </Button>
                </div>
              </div>
              <div className="text-sm text-yellow-400">
                <strong>Note:</strong> Groq provides fast conversation with Geoffrey, but Qloo provides the actual taste
                intelligence. Both are needed for the full experience.
              </div>
            </CardContent>
          </Card>
        )}

        {/* ElevenLabs Voice ID Highlight */}
        {process.env.ELEVENLABS_API_KEY && !process.env.ELEVENLABS_VOICE_ID && (
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Mic className="w-8 h-8 text-blue-400" />
                <div>
                  <CardTitle className="text-white text-xl">Voice ID Required</CardTitle>
                  <CardDescription className="text-slate-300">
                    You have ElevenLabs configured but need to set a voice ID for Geoffrey
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600 mb-4">
                <p className="text-sm text-slate-400 mb-2">Popular voice IDs you can use:</p>
                <div className="space-y-1 text-sm">
                  <div className="text-green-400">
                    <strong>Adam:</strong> pNInz6obpgDQGcFmaJgB (deep, authoritative)
                  </div>
                  <div className="text-green-400">
                    <strong>Antoni:</strong> ErXwobaYiN019PkySvjV (well-balanced)
                  </div>
                  <div className="text-green-400">
                    <strong>Josh:</strong> TxGEqnHWrfWFTfGW9XjX (light, friendly)
                  </div>
                  <div className="text-green-400">
                    <strong>Sam:</strong> yoZ06aMxZJJ28mfd3POQ (casual, conversational)
                  </div>
                </div>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <a href="/voice-setup">
                  <Mic className="w-4 h-4 mr-2" />
                  Configure Geoffrey's Voice
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {setupItems.map((item) => (
            <Card
              key={item.name}
              className={`bg-slate-800/50 border-slate-700 ${
                item.name === "Qloo Taste Intelligence" ? "ring-2 ring-purple-500/30" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    {item.configured ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    {item.icon && <item.icon className="w-5 h-5 text-purple-400" />}
                    <span className="text-sm">{item.name}</span>
                  </CardTitle>
                  <Badge variant={item.required ? "destructive" : "secondary"} className="text-xs">
                    {item.required ? "Required" : "Optional"}
                  </Badge>
                </div>
                <CardDescription className="text-slate-400 text-sm">{item.description}</CardDescription>
                {item.additionalInfo && <p className="text-xs text-yellow-400 mt-1">{item.additionalInfo}</p>}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-slate-900/50 p-3 rounded border border-slate-600">
                    <p className="text-xs text-slate-400 mb-1">Environment Variables:</p>
                    <code className="text-xs text-green-400 break-all">{item.envVar}</code>
                  </div>
                  {item.setupUrl && !item.configured && (
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <a href={item.setupUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Get API Keys
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Complete Environment Variables Template</CardTitle>
            <CardDescription className="text-slate-400">
              Copy this template to your .env.local file and fill in your API keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 p-4 rounded border border-slate-600 mb-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-green-400 whitespace-pre-wrap">
                {`# ===================================
# REQUIRED - Core Platform
# ===================================

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Groq AI (Geoffrey assistant)
GROQ_API_KEY=gsk_...

# Qloo Taste Intelligence (CORE ENGINE)
QLOO_API_KEY=your_qloo_api_key
QLOO_API_URL=https://api.qloo.com/v1

# ===================================
# OPTIONAL - Enhanced Features
# ===================================

# ElevenLabs Voice (Geoffrey voice synthesis)
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Popular Voice IDs (choose one):
# ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB  # Adam (deep, authoritative)
# ELEVENLABS_VOICE_ID=ErXwobaYiN019PkySvjV  # Antoni (well-balanced)
# ELEVENLABS_VOICE_ID=TxGEqnHWrfWFTfGW9XjX  # Josh (light, friendly)
# ELEVENLABS_VOICE_ID=yoZ06aMxZJJ28mfd3POQ  # Sam (casual, conversational)

# Platform Integrations
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
YOUTUBE_API_KEY=...
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
STEAM_API_KEY=...`}
              </pre>
            </div>
            <Button
              onClick={copyEnvTemplate}
              variant="outline"
              className="border-slate-600 text-slate-300 bg-transparent"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Complete Template
            </Button>
          </CardContent>
        </Card>

        {allRequired && (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Platform Ready! 🎉</h2>
              <p className="text-slate-300 mb-4">
                Your unv3iled platform is configured and ready to launch. Add voice features for the full experience!
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Launch unv3iled
                </Button>
                {process.env.ELEVENLABS_API_KEY && (
                  <Button asChild variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                    <a href="/voice-setup">Configure Voice</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
