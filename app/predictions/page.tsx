import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PredictionsPanel } from "@/components/predictions-panel"

export default async function PredictionsPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Future Predictions</h1>
          <p className="text-slate-400">Discover what you'll love before you know you love it</p>
        </div>

        <PredictionsPanel userId={userId} />
      </main>
    </div>
  )
}
