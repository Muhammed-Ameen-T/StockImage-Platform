"use client"

import Image from "next/image"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { setSelectedIds } from "@/redux/slices/imagesSlice"
import { ImagesAPI } from "@/services/api"
import type { ImageItem } from "@/types"

export default function ImageCard({ item, onDeleted }: { item: ImageItem; onDeleted: () => void }) {
  const dispatch = useAppDispatch()
  const selectedIds = useAppSelector((s) => s.images.selectedIds)
  const selected = selectedIds.includes(item.id)

  const toggleSelect = () => {
    const next = selected ? selectedIds.filter((id) => id !== item.id) : [...selectedIds, item.id]
    dispatch(setSelectedIds(next))
  }

  return (
    <div className="group rounded border">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={item.url || "/placeholder.svg?height=600&width=600&query=missing%20image"}
          alt={item.title || "image"}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={selected} onChange={toggleSelect} aria-label="Select image" />
          <div className="text-sm">{item.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded border px-2 py-1 text-xs hover:bg-accent" href={`/edit/${item.id}`}>
            Edit
          </Link>
          <button
            className="rounded border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            onClick={async () => {
              const ok = window.confirm("Delete this image?")
              if (!ok) return
              await ImagesAPI.remove(item.id)
              onDeleted()
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
