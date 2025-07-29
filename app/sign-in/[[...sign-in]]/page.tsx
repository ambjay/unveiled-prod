import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to unv3iled</h1>
          <p className="text-slate-400">Sign in to discover your taste DNA</p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
