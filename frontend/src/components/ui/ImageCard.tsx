"use client"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { ImageItem } from "@/types"
import { Trash2, Pencil, Eye, GripVertical } from "lucide-react"

interface ImageCardProps {
  item: ImageItem
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onDragStart?: (e: React.DragEvent, id: string) => void
  onDragOver?: (e: React.DragEvent, id: string) => void
  onDrop?: (e: React.DragEvent, id: string) => void
  onDragEnter?: (e: React.DragEvent, id: string) => void
  onDragLeave?: (e: React.DragEvent, id: string) => void
  onDragEnd?: (e: React.DragEvent, id: string) => void
  isDraggingOver: boolean
  draggable: boolean 
  isReorderDisabled: boolean
}

export function ImageCard({
  item,
  onView,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragEnd,
  isDraggingOver,
}: ImageCardProps) {
  return (
    <div
      className={`relative group rounded-xl overflow-hidden border-2 bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isDraggingOver 
          ? "ring-4 ring-blue-400 border-blue-400 bg-blue-50 shadow-2xl scale-105" 
          : "border-gray-200 hover:border-gray-300"
      }`}
      onDragOver={(e) => {
        onDragOver?.(e, item._id)
      }}
      onDrop={(e) => {
        onDrop?.(e, item._id)
      }}
      onDragEnter={(e) => {
        onDragEnter?.(e, item._id)
      }}
      onDragLeave={(e) => {
        onDragLeave?.(e, item._id)
      }}
      onDragEnd={(e) => {
        onDragEnd?.(e, item._id)
      }}
    >
      {/* Image Container */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={item.url || "/placeholder.svg?height=600&width=600&query=missing%20image"}
          alt={item.title || "image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Drag Handle */}
        <button
          className="absolute top-3 left-3 p-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-grab active:cursor-grabbing hover:bg-white hover:scale-110"
          aria-label="Drag to reorder"
          draggable
          onDragStart={(e) => onDragStart?.(e, item._id)}
          onDragEnd={(e) => onDragEnd?.(e, item._id)}
        >
          <GripVertical size={16} />
        </button>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onView}
            className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200"
            aria-label="View image"
          >
            <Eye size={16} className="text-gray-700" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onEdit}
            className="p-2 bg-blue-600/90 backdrop-blur-sm hover:bg-blue-600 hover:scale-110 transition-all duration-200"
            aria-label="Edit image"
          >
            <Pencil size={16} className="text-white" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="p-2 bg-red-600/90 backdrop-blur-sm hover:bg-red-600 hover:scale-110 transition-all duration-200"
            aria-label="Delete image"
          >
            <Trash2 size={16} className="text-white" />
          </Button>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="px-4 py-2.5 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-md font-semibold text-gray-900 line-clamp-2 leading-relaxed">
            {item.title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-full font-medium">
            {(item.fileSize / 1024 / 1024).toFixed(2)} MB
          </span>
          <span className="capitalize">
            {item.mimeType.split('/')[1]}
          </span>
        </div>
      </div>
    </div>
  )
}