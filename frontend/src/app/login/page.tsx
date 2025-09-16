"use client"
import Providers from "@/components/layout/providers"
import LoginForm from "@/components/forms/login-form"
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated"

export default function Page() {
  const shouldRender = useRedirectIfAuthenticated()

  if (!shouldRender) return null 
  
  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-0">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 text-base">
              Sign in to manage your images
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don&lsquo;t have an account?{" "}
              <a 
                href="/register" 
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
              >
                Sign up for free
              </a>
            </p>
          </div>
        </div>
      </main>
    </Providers>
  )
}