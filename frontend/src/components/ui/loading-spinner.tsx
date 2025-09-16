"use client"

import React from "react"

interface LoadingSpinnerProps {
  text?: string
  size?: number // in pixels
  className?: string
}

export default function LoadingSpinner({
  text = "Loading...",
  size = 24,
  className = "",
}: LoadingSpinnerProps) {   
  return (
    <div className={`flex items-center justify-center py-10 space-x-3 text-sm text-muted-foreground ${className}`}>
      <div
        className="rounded-full border-2 border-black border-t-transparent animate-spin"
        style={{ width: size, height: size }}
      />
      <span className="tracking-wide font-medium">{text}</span>
    </div>
  )
}
