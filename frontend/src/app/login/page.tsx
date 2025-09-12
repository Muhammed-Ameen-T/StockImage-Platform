"use client"

import Providers from "@/components/layout/providers"
import LoginForm from "@/components/forms/login-form"

export default function Page() {
  return (
    <Providers>
      <main className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-600">Sign in to your account to continue</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-8">
            <LoginForm />
          </div>
        </div>
      </main>
    </Providers>
  )
}