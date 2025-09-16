// Enhanced LoginForm Component
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLogin } from "@/hooks/userAuth"
import { EmailIcon, EyeIcon, LockIcon, EyeOffIcon } from "../ui/form-icons"
import { toast } from "sonner"

export default function LoginForm() {
  const router = useRouter()
  const { submit, loading, serverError, errors } = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await submit({ email, password })
    if (res){
      router.push("/dashboard")
      toast.success("Login successful!")
    } 
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Email address
          <span className="ml-1 text-red-500 text-xl">*</span>   
       </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EmailIcon />
          </div>
          <input
            type="email"
            className={`
              block w-full pl-10 pr-3 py-3 border rounded-xl text-sm
              transition-all duration-200 ease-in-out
              placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              hover:border-gray-300
              ${errors?.email 
                ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-200 bg-white hover:bg-gray-50/50 focus:bg-white'
              }
            `}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
        {errors?.email && (
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-red-600">{errors.email}</p>
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Password          <span className="ml-1 text-red-500 text-xl">*</span>   

        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockIcon />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            className={`
              block w-full pl-10 pr-10 py-3 border rounded-xl text-sm
              transition-all duration-200 ease-in-out
              placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              hover:border-gray-300
              ${errors?.password 
                ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-200 bg-white hover:bg-gray-50/50 focus:bg-white'
              }
            `}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors?.password && (
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-red-600">{errors.password}</p>
          </div>
        )}
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800" role="alert">
              {serverError}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className={`
          w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-blue-500/20
          ${loading || !email || !password
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Sign in to your account</span>
          </div>
        )}
      </button>
    </form>
  )
}