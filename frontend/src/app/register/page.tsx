"use client"

import Providers from "@/components/layout/providers"
import RegisterForm from "@/components/forms/register-form"

export default function Page() {
  return (
    <Providers>
      <main className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-600">Start managing your images today</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-8">
            <RegisterForm />
          </div>
        </div>
      </main>
    </Providers>
  )
}