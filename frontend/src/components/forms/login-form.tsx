"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLogin } from "@/hooks/userAuth"

export default function LoginForm() {
  const router = useRouter()
  const { submit, loading, error } = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault()
        const res = await submit({ email, password })
        if (res) router.push("/dashboard")
      }}
    >
      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800" role="alert">
            {error}
          </p>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </div>
        ) : (
          "Sign in"
        )}
      </button>
      <div className="text-center">
        <a className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200" href="/reset-password">
          Forgot password?
        </a>
      </div>
    </form>
  )
}