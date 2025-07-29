import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "unv3iled - AI-Powered Taste Prediction",
  description: "Discover what you'll love before you know you love it",
    generator: 'v0.dev'
}

// Check if Clerk is properly configured
const isClerkConfigured = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If Clerk is not configured, show a setup message
  if (!isClerkConfigured) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚙️</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Setup Required</h1>
              <p className="text-slate-300 mb-6">To run unv3iled, you need to configure Clerk authentication:</p>
              <div className="text-left bg-slate-900/50 p-4 rounded border border-slate-600 mb-6">
                <p className="text-sm text-slate-400 mb-2">Add these to your .env.local:</p>
                <code className="text-xs text-green-400 block">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
                  <br />
                  CLERK_SECRET_KEY=sk_test_...
                </code>
              </div>
              <a
                href="https://dashboard.clerk.com/last-active?path=api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Clerk API Keys
              </a>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#8b5cf6",
          colorBackground: "#0f172a",
          colorInputBackground: "#1e293b",
        },
      }}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
