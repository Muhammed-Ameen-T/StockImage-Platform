"use client"

import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { SWRConfig } from "swr"
import { store, persistor } from "@/redux/store"
import { useEffect, useState } from "react"

function PersistGateLite({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => {
    try {
      return persistor.getState().bootstrapped
    } catch {
      return true
    }
  })

  useEffect(() => {
    const unsub = persistor.subscribe(() => {
      const state = persistor.getState()
      if (state.bootstrapped) {
        setReady(true)
      }
    })
    return unsub
  }, [])

  if (!ready) {
    return <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">Loading…</div>
  }

  return <>{children}</>
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGateLite>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            shouldRetryOnError: false,
          }}
        >
          {children}
        </SWRConfig>
      </PersistGateLite>
    </Provider>
  )
}
