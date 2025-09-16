import { useState, useRef } from "react"
import Image from "next/image"
import { ImagesAPI } from "@/services/imageApi"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { ImageItem } from "@/types"
import { Upload } from "lucide-react"

interface EditImageModalProps {
  isOpen: boolean
  onClose: () => void
  item: ImageItem
  onUpdated: () => void
  setError: (error: string | null) => void
}

export function EditImageModal({ 
  isOpen, 
  onClose, 
  item, 
  onUpdated, 
  setError 
}: EditImageModalProps) {
  const [title, setTitle] = useState(item.title)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File | null) => {
    if (!file) return true
    const validTypes = ["image/jpeg", "image/png"]
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!validTypes.includes(file.type)) {
      setValidationError("Only JPEG, PNG files are allowed")
      return false
    }
    
    if (file.size > maxSize) {
      setValidationError("File size must be less than 5MB")
      return false
    }
    
    setValidationError(null)
    return true
  }

  const handleFileChange = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileChange(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const clearFile = () => {
    setFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setValidationError(null)
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      setValidationError("Title is required")
      return
    }

    if (file && !validateFile(file)) return

    setIsSubmitting(true)
    setValidationError(null)

    try {
      const payload: {
        title: string
        file?: File | null
        originalFileName?: string
        mimeType?: string
        fileSize?: number
      } = {
        title: title.trim(),
      }

      if (file) {
        payload.file = file
        payload.originalFileName = file.name
        payload.mimeType = file.type
        payload.fileSize = file.size
      }

      await ImagesAPI.update(item._id, payload)
      onUpdated()
      handleClose()
    } catch (err) {
      setError("Failed to update image. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setTitle(item.title)
    setFile(null)
    setPreviewUrl(null)
    setValidationError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClose()
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
      onClose={handleClose} 
      title="Edit Image"
      className="max-w-md"
    >
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Title *
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            placeholder="Enter image title"
          />
        </div>

        {/* Current Image Info */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Current Image
          </label>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <p className="truncate">{item.originalFileName}</p>
            <p>{formatFileSize(item.fileSize)} • {item.mimeType.replace('image/', '').toUpperCase()}</p>
          </div>
        </div>

        {/* Image Upload/Preview Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Replace Image (Optional)
          </label>
          
          {!previewUrl ? (
            // Drag and Drop Area
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <div className="space-y-2">
                <div className="mx-auto w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Upload size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drop image or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG up to 5MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Image Preview with Remove Button
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Image Preview</span>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={clearFile}
                  className="flex items-center gap-1 text-xs px-2 py-1"
                >
                  Remove
                </Button>
              </div>
              
              <div className="relative w-full h-32 bg-gray-50 rounded-lg overflow-hidden border-2 border-green-200">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
              
              {file && (
                <div className="text-xs text-gray-500 bg-green-50 p-2 rounded">
                  <p className="truncate">{file.name}</p>
                  <p>{formatFileSize(file.size)} • {file.type.replace('image/', '').toUpperCase()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
            <p className="text-red-800">{validationError}</p>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim()}
          className="min-w-[80px]"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  )
}