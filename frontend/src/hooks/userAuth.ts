"use client"

import { useState } from "react"
import { z } from "zod"
import { useAppDispatch } from "@/redux/store"
import { setCredentials } from "@/redux/slices/authSlice"
import { AuthAPI } from "@/services/api"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
})

const resetSchema = z.object({
  email: z.string().email(),
  token: z.string().min(6),
  password: z.string().min(6),
})

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const submit = async (values: z.infer<typeof loginSchema>) => {
    setError(null)
    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Invalid input")
      return
    }
    setLoading(true)
    try {
      const data = await AuthAPI.login(parsed.data)
      dispatch(setCredentials(data)) // expects { token, user }
      return data
    } catch (e: any) {
      setError(e?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const submit = async (values: z.infer<typeof registerSchema>) => {
    setError(null)
    const parsed = registerSchema.safeParse(values)
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Invalid input")
      return
    }
    setLoading(true)
    try {
      // Create and then auto-login
      await AuthAPI.register(parsed.data)
      const login = await AuthAPI.login({ email: parsed.data.email, password: parsed.data.password })
      dispatch(setCredentials(login))
      return login
    } catch (e: any) {
      setError(e?.response?.data?.message || "Register failed")
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}

export function useResetPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = async (values: z.infer<typeof resetSchema>) => {
    setError(null)
    const parsed = resetSchema.safeParse(values)
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Invalid input")
      return
    }
    setLoading(true)
    try {
      return await AuthAPI.resetPassword(parsed.data)
    } catch (e: any) {
      setError(e?.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }
  return { submit, loading, error }
}
