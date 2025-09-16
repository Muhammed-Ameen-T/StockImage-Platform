"use client"

import { useAppSelector } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import LoadingSpinner from "../ui/loading-spinner"

export default function Protected({ children }: { children: ReactNode }) {
  const token = useAppSelector((state) => state.auth.accessToken)
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router])
  
  if (!token) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
}
