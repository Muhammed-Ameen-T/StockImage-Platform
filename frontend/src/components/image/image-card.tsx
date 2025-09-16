// components/image/ImageCard.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { ImagesAPI } from "@/services/imageApi"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { ImageItem } from "@/types"
import { EditImageModal } from "../ui/EditImageModal"

interface ImageCardProps {
  item: ImageItem
  onDeleted: () => void
  onUpdated: () => void
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDrop: (e: React.DragEvent, id: string) => void
  onDragEnter: (e: React.DragEvent, id: string) => void
  onDragLeave: (e: React.DragEvent, id: string) => void
  isDraggingOver: boolean
}

export function ImageCard({
  item,
  onDeleted,
  onUpdated,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnter,
  onDragLeave,
  isDraggingOver,
}: ImageCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div
      className={`relative group rounded-lg overflow-hidden border bg-background transition-all ${
        isDraggingOver ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      onDragOver={(e) => onDragOver(e, item._id)}
      onDrop={(e) => onDrop(e, item._id)}
      onDragEnter={(e) => onDragEnter(e, item._id)}
      onDragLeave={(e) => onDragLeave(e, item._id)}
    >
      <div className="relative w-full h-48">
        <Image
          src={item.url || "/placeholder.svg?height=600&width=600&query=missing%20image"}
          alt={item.title || "image"}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <button
          className="absolute top-2 left-2 cursor-grab text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Drag to reorder"
          draggable
          onDragStart={(e) => onDragStart(e, item._id)}
        >
          ⠿
        </button>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <h3 className="text-sm font-medium truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground">
          {(item.fileSize / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      <EditImageModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={item}
        onUpdated={onUpdated}
        setError={setError}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete &quot;{item.title}&quot;?</p>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await ImagesAPI.remove(item._id)
                  onDeleted()
                  setIsDeleteModalOpen(false)
                } catch (err) {
                  setError("Failed to delete image")
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}