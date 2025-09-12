"use client"

import Providers from "@/components/layout/providers"
import Protected from "@/components/layout/protected"
import { useParams, useRouter } from "next/navigation"
import { useImage } from "@/hooks/useImages"
import { useState } from "react"
import { ImagesAPI } from "@/services/api"

export default function Page() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { image, isLoading, mutate } = useImage(id)
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  return (
    <Providers>
      <Protected>
        <main className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="mb-4 text-xl font-semibold">Edit Image</h1>
          {isLoading || !image ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault()
                setSaving(true)
                try {
                  await ImagesAPI.update(image.id, {
                    title: title || image.title,
                    file,
                  })
                  await mutate()
                  router.push("/dashboard")
                } finally {
                  setSaving(false)
                }
              }}
            >
              <div>
                <label className="mb-1 block text-sm">Title</label>
                <input
                  className="w-full rounded border px-3 py-2"
                  defaultValue={image.title}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Image title"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Replace Image</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-foreground px-4 py-2 text-background disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button type="button" className="rounded border px-4 py-2" onClick={() => router.back()}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </main>
      </Protected>
    </Providers>
  )
}
