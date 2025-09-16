import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Providers from "@/components/layout/providers"
import Navbar from "@/components/layout/navbar"
import { Suspense } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Image Manager",
  description: "Manage and organize your images with ease.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <Suspense
            fallback={<LoadingSpinner />}
          >
            <Navbar />
            {children}
          </Suspense>
        </Providers>
        <Toaster richColors position="bottom-right" />
        <Analytics />
      </body>
    </html>
  )
}
