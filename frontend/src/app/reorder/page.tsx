"use client"

import type React from "react"
import Providers from "@/components/layout/providers"
import Protected from "@/components/layout/protected"
import { useImages } from "@/hooks/useImages"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { moveItem, setReorderList, clearWorking } from "@/redux/slices/imagesSlice"
import { useEffect, useRef, useState } from "react"
import { ImagesAPI } from "@/services/api"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const { images, isLoading } = useImages()
  const selectedIds = useAppSelector((s) => s.images.selectedIds)
  const reorderList = useAppSelector((s) => s.images.reorderList)
  const dispatch = useAppDispatch()
  const dragIndex = useRef<number | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && reorderList.length === 0 && selectedIds.length > 0) {
      const seed = images.filter((i) => selectedIds.includes(i.id))
      dispatch(setReorderList(seed))
    }
  }, [isLoading, images, selectedIds, reorderList.length, dispatch])

  const onDragStart = (idx: number) => (e: React.DragEvent) => {
    dragIndex.current = idx
    e.dataTransfer.effectAllowed = "move"
  }

  const onDrop = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault()
    const from = dragIndex.current
    if (from === null || from === idx) return
    dispatch(moveItem({ fromIndex: from, toIndex: idx }))
    dragIndex.current = null
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const save = async () => {
    setSaving(true)
    try {
      await ImagesAPI.reorder(reorderList.map((i) => i.id))
      dispatch(clearWorking())
      router.push("/dashboard")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Providers>
      <Protected>
        <main className="mx-auto max-w-3xl px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Reorder Selected</h1>
            <button
              className="rounded bg-foreground px-3 py-2 text-sm text-background disabled:opacity-50"
              onClick={save}
              disabled={saving || reorderList.length === 0}
            >
              {saving ? "Saving…" : "Save order"}
            </button>
          </div>
          {selectedIds.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No selected images. Go back to the dashboard and select images first.
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {reorderList.map((it, idx) => (
                <li
                  key={it.id}
                  draggable
                  onDragStart={onDragStart(idx)}
                  onDragOver={onDragOver}
                  onDrop={onDrop(idx)}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="cursor-grab select-none text-sm text-muted-foreground">⠿</span>
                    <div className="text-sm">{it.title}</div>
                  </div>
                  <small className="text-xs text-muted-foreground">#{idx + 1}</small>
                </li>
              ))}
            </ul>
          )}
        </main>
      </Protected>
    </Providers>
  )
}
