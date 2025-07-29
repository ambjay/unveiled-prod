import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { DashboardHeader } from "@/components/dashboard-header"
import { PredictionsPanel } from "@/components/predictions-panel"
import { TasteTimeline } from "@/components/taste-timeline"
import { PlatformStatus } from "@/components/platform-status"
import { GeoffreyAssistant } from "@/components/geoffrey-assistant"
import { DiscoveryFeed } from "@/components/discovery-feed"
import { SetupGuide } from "@/components/setup-guide"
import LandingPage from "./landing-page"

// Check if all required services are configured
const isFullyConfigured = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.GROQ_API_KEY
)

export default async function HomePage() {
  // If not fully configured, show setup guide
  if (!isFullyConfigured) {
    return <SetupGuide />
  }

  const { userId } = auth()

  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        {userId && (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <Suspense fallback={<div className="animate-pulse bg-slate-800 rounded-lg h-96" />}>
                    <PredictionsPanel userId={userId} />
                  </Suspense>

                  <Suspense fallback={<div className="animate-pulse bg-slate-800 rounded-lg h-64" />}>
                    <TasteTimeline userId={userId} />
                  </Suspense>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Suspense fallback={<div className="animate-pulse bg-slate-800 rounded-lg h-48" />}>
                    <PlatformStatus userId={userId} />
                  </Suspense>

                  <Suspense fallback={<div className="animate-pulse bg-slate-800 rounded-lg h-64" />}>
                    <DiscoveryFeed userId={userId} />
                  </Suspense>
                </div>
              </div>
            </main>

            {/* Geoffrey AI Assistant */}
            <GeoffreyAssistant userId={userId} />
          </div>
        )}
      </SignedIn>
    </>
  )
}
