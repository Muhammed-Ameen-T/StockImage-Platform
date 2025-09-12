"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useResetPassword } from "@/hooks/userAuth"
import { useState, useEffect } from "react"

export default function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const presetToken = params.get("token") || ""
  const presetEmail = params.get("email") || ""
  const { submit, loading, error } = useResetPassword()
  const [email, setEmail] = useState(presetEmail)
  const [token, setToken] = useState(presetToken)
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (presetToken) setToken(presetToken)
    if (presetEmail) setEmail(presetEmail)
  }, [presetToken, presetEmail])

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault()
        const res = await submit({ email, token, password })
        if (res) router.push("/login")
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
        <label className="form-label">Reset Token</label>
        <input
          type="text"
          className="form-input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your reset token here"
          required
        />
        <p className="mt-2 text-xs text-slate-500">
          Check your email for the reset token
        </p>
      </div>
      <div>
        <label className="form-label">New Password</label>
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
            <span>Resetting password...</span>
          </div>
        ) : (
          "Reset password"
        )}
      </button>
    </form>
  )
}