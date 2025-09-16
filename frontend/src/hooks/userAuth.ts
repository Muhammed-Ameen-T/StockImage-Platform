"use client"

import { useState } from "react"
import { z } from "zod"
import { useAppDispatch } from "@/redux/store"
import { setCredentials, logout as logoutAction } from "@/redux/slices/authSlice"
import { AuthAPI } from "@/services/authApi"
import { toast } from "sonner"
import { APIError } from "@/types"

// SCHEMAS
const loginSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, { message: "Current password must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
})

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(8, { message: "Phone number is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  otp: z.string().min(4, { message: "OTP is required" }),
})

// HOOK: LOGIN
export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ email?: string; password?: string } | null>(null)
  const dispatch = useAppDispatch()

  const submit = async (values: z.infer<typeof loginSchema>) => {
    setServerError(null)
    setErrors(null)

    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof fieldErrors
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return false
    }

    setLoading(true)
    try {
      const data = await AuthAPI.login(parsed.data.email, parsed.data.password)
      dispatch(setCredentials(data))
      return data
    } catch (e: unknown) {
      setServerError((e as APIError)?.response?.data?.message || (e as Error)?.message || "Login failed")
      toast.error((e as APIError)?.response?.data?.message || (e as Error)?.message || "Login failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, serverError, errors }
}

// HOOK: CHANGE PASSWORD
export function useChangePassword() {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ oldPassword?: string; newPassword?: string } | null>(null)

  const submit = async (values: z.infer<typeof changePasswordSchema>) => {
    setServerError(null)
    setErrors(null)

    const parsed = changePasswordSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof fieldErrors
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return false
    }

    setLoading(true)
    try {
      await AuthAPI.changePassword(parsed.data.oldPassword, parsed.data.newPassword)
      return true
    } catch (e: unknown) {
      const errorMessage = (e as APIError)?.response?.data?.message || (e as Error)?.message || "Password change failed"
      setServerError(errorMessage)
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, serverError, errors }
}

// HOOK: SEND OTP
export function useSendOtp() {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<z.infer<typeof registerSchema>> | null>(null)

  const submit = async (values: Omit<z.infer<typeof registerSchema>, "otp">) => {
    setServerError(null)
    setErrors(null)

    const parsed = registerSchema.omit({ otp: true }).safeParse(values)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof fieldErrors
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return false
    }

    setLoading(true)
    try {
      await AuthAPI.sendOtp(parsed.data.email)
      return true
    } catch (e: unknown) {
      setServerError((e as APIError)?.response?.data?.message || (e as Error)?.message || "OTP send failed")
      toast.error((e as APIError)?.response?.data?.message || (e as Error)?.message || "OTP send failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, serverError, errors }
}

// HOOK: VERIFY OTP
export function useVerifyOtp() {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<z.infer<typeof registerSchema>> | null>(null)
  const dispatch = useAppDispatch()

  const submit = async (values: z.infer<typeof registerSchema>) => {
    setServerError(null)
    setErrors(null)

    const parsed = registerSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof fieldErrors
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return false
    }

    setLoading(true)
    try {
      const data = await AuthAPI.verifyOtp(
        parsed.data.name,
        parsed.data.email,
        parsed.data.phone,
        parsed.data.otp,
        parsed.data.password
      )
      dispatch(setCredentials(data))
      return data
    } catch (e: unknown) {
      setServerError((e as APIError)?.response?.data?.message || (e as Error)?.message || "OTP verification failed")
      toast.error((e as APIError)?.response?.data?.message || (e as Error)?.message || "OTP verification failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, serverError, errors }
}