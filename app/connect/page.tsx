import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PlatformOAuth } from "@/components/platform-oauth"

export default async function ConnectPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Connect Your Platforms</h1>
          <p className="text-slate-400">Link your accounts to build a comprehensive taste profile</p>
        </div>

        <PlatformOAuth userId={userId} />
      </main>
    </div>
  )
}
