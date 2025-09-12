"use client"

import Providers from "@/components/layout/providers"
import ResetPasswordForm from "@/components/forms/reset-password-form"

export default function Page() {
  return (
    <Providers>
      <main className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Reset your password</h1>
            <p className="text-slate-600">Enter your details to reset your password</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-8">
            <ResetPasswordForm />
          </div>
        </div>
      </main>
    </Providers>
  )
}