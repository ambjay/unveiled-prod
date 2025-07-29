import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { CulturalDNAAnalyzer } from "@/components/cultural-dna-analyzer"
import { AdvancedPredictions } from "@/components/advanced-predictions"

export default async function DNAPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cultural DNA Analysis</h1>
          <p className="text-slate-400">Deep dive into your taste patterns and cultural preferences</p>
        </div>

        <div className="space-y-8">
          <CulturalDNAAnalyzer userId={userId} />
          <AdvancedPredictions userId={userId} />
        </div>
      </main>
    </div>
  )
}
