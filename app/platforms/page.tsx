import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PlatformConnections } from "@/components/platform-connections"

export default async function PlatformsPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Platform Connections</h1>
          <p className="text-slate-400">Connect your platforms to enhance taste predictions</p>
        </div>

        <PlatformConnections userId={userId} />
      </main>
    </div>
  )
}
