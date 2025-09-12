"use client"

import Providers from "@/components/layout/providers"
import Protected from "@/components/layout/protected"
import ImageCard from "@/components/image/image-card"
import { useImages } from "@/hooks/useImages"
import { useAppSelector } from "@/redux/store"
import Link from "next/link"

export default function Page() {
  const { images, isLoading, mutate } = useImages()
  const selectedIds = useAppSelector((s) => s.images.selectedIds)

  return (
    <Providers>
      <Protected>
        {/* <Navbar /> */}
        <main className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Your Images</h1>
            <div className="flex items-center gap-2">
              <Link className="rounded border px-3 py-2 text-sm hover:bg-accent" href="/upload">
                Upload
              </Link>
              <Link
                className="rounded bg-foreground px-3 py-2 text-sm text-background disabled:opacity-50"
                href="/reorder"
                aria-disabled={selectedIds.length === 0}
                onClick={(e) => {
                  if (selectedIds.length === 0) {
                    e.preventDefault()
                  }
                }}
              >
                Reorder selected
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="py-10 text-sm text-muted-foreground">Loading images…</div>
          ) : images.length === 0 ? (
            <div className="py-10 text-sm">
              No images yet.{" "}
              <Link className="underline" href="/upload">
                Upload some
              </Link>
              .
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((img) => (
                <ImageCard key={img.id} item={img} onDeleted={() => mutate()} />
              ))}
            </div>
          )}
        </main>
      </Protected>
    </Providers>
  )
}
