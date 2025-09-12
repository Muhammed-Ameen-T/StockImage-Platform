"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useRegister } from "@/hooks/userAuth"

export default function RegisterForm() {
  const router = useRouter()
  const { submit, loading, error } = useRegister()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault()
        const res = await submit({ email, phone, password })
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
        <label className="form-label">Phone</label>
        <input
          type="tel"
          className="form-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000"
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
            <span>Creating account...</span>
          </div>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  )
}