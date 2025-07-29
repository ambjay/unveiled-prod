import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SocialTasteNetwork } from "@/components/social-taste-network"
import { TasteSharing } from "@/components/taste-sharing"

export default async function SocialPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Social Taste Network</h1>
          <p className="text-slate-400">Connect with others who share your cultural DNA</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <SocialTasteNetwork userId={userId} />
          <TasteSharing userId={userId} />
        </div>
      </main>
    </div>
  )
}
