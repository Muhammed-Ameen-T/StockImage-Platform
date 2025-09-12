"use client"

import Providers from "@/components/layout/providers"
import Navbar from "@/components/layout/navbar"
import Protected from "@/components/layout/protected"
import UploadList from "@/components/image/upload-list"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  return (
    <Providers>
      <Protected>
        <main className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="mb-4 text-xl font-semibold">Bulk Upload</h1>
          <UploadList onUploaded={() => router.push("/dashboard")} />
        </main>
      </Protected>
    </Providers>
  )
}
