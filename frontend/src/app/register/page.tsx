"use client"

import Providers from "@/components/layout/providers"
import RegisterForm from "@/components/forms/register-form"
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated"

export default function Page() {
  const shouldRender = useRedirectIfAuthenticated()

  if (!shouldRender) return null 
  
  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 text-base">
              Join us and start managing your images today
            </p>
          </div>

          {/* Register Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
            <RegisterForm />
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
              >
                Sign in instead
              </a>
            </p>
          </div>
        </div>
      </main>
    </Providers>
  )
}