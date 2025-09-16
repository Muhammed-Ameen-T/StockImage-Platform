import { useState } from "react"
import Image from "next/image"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { ImageItem } from "@/types"
import { Download, ExternalLink, Calendar, FileText, HardDrive } from "lucide-react"

interface ViewImageModalProps {
  isOpen: boolean
  onClose: () => void
  item: ImageItem
}

export function ViewImageModal({ isOpen, onClose, item }: ViewImageModalProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleOpenInNewTab = () => {
    window.open(item.url, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={item.title}
      className="max-w-lg"
    >
      <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
        {/* Action Buttons */}
        <div className="flex justify-end">
            <button
                onClick={handleOpenInNewTab}
                className="inline-flex items-center justify-center gap-1 
                        px-2 py-1 text-xs font-medium 
                        rounded-md shadow-sm transition-all duration-200 
                        bg-gray-100 text-gray-900 
                        hover:bg-gray-200 hover:shadow 
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                        active:scale-95"
            >
                <ExternalLink size={14} />
                Open
            </button>
        </div>
        {/* Image Display */}
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          <div className="relative w-full h-48">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
            {!imageError ? (
              <Image
                src={item.url}
                alt={item.title}
                fill
                className={`object-contain transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true)
                  setImageLoading(false)
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Failed to load image</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* File Details - Compact Layout */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">File Details</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
              <FileText size={14} className="text-gray-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-gray-900">File: </span>
                <span className="text-gray-600 break-all">{item.originalFileName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
              <FileText size={14} className="text-gray-600 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-900">Type: </span>
                <span className="text-gray-600 capitalize">
                  {item.mimeType.replace('image/', '')} Image
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
              <HardDrive size={14} className="text-gray-600 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-900">Size: </span>
                <span className="text-gray-600">{formatFileSize(item.fileSize)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline - Compact Layout */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Timeline</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
              <Calendar size={14} className="text-gray-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-gray-900">Created: </span>
                <span className="text-gray-600">{formatDate(item.createdAt)}</span>
              </div>
            </div>

            {item.updatedAt && item.updatedAt !== item.createdAt && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                <Calendar size={14} className="text-gray-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-gray-900">Modified: </span>
                  <span className="text-gray-600">{formatDate(item.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close Button - Fixed at bottom */}
      <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
        <Button variant="destructive" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  )
}