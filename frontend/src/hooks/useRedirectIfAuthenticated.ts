// hooks/useRedirectIfAuthenticated.ts
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/store"

export function useRedirectIfAuthenticated(redirectTo = "/dashboard") {
  const router = useRouter()
  const token = useAppSelector((state) => state.auth.accessToken)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (token) {
      router.replace(redirectTo)
    } else {
      setShouldRender(true)
    }
  }, [token, router, redirectTo])

  return shouldRender
}
