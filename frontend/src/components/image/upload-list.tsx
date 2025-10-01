"use client"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import Image from "next/image"
import { ImagesAPI } from "@/services/imageApi"
import { Input } from "@/components/ui/Input"
import { toast } from "sonner"

type FileEntry = {
  file: File
  title: string
  originalFileName: string
  mimeType: string
  preview: string
  id: string
}

type ValidationError = {
  type: "size" | "format" | "title" | "upload"
  message: string
}

type Props = {
  onUploaded: () => void
}

export default function UploadList({ onUploaded }: Props) {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: ValidationError }>({})
  const fileInputRef = useRef<HTMLInputElement>(null) // Add ref for file input

  const validateFile = (file: File): ValidationError | null => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return {
        type: "format",
        message: "Only JPEG and PNG files are allowed",
      }
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        type: "size",
        message: "File size must be less than 5MB",
      }
    }

    return null
  }

  const validateTitle = (title: string): ValidationError | null => {
    if (!title.trim()) {
      return {
        type: "title",
        message: "Title is required",
      }
    }
    return null
  }

  const createFileEntry = (file: File): FileEntry => {
    const id = Math.random().toString(36).substr(2, 9)
    return {
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      originalFileName: file.name,
      mimeType: file.type,
      preview: URL.createObjectURL(file),
      id,
    }
  }

  const MAX_FILES = 10

  const onChangeFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const newFiles: FileEntry[] = []
    const newErrors: { [key: string]: ValidationError } = {}

    const currentFileCount = files.length
    const filesToAdd = Array.from(fileList)

    filesToAdd.forEach((file) => {
      if (currentFileCount + newFiles.length >= MAX_FILES) {
        const tempId = Math.random().toString(36).substr(2, 9)
        newErrors[tempId] = {
          type: "size",
          message: `Maximum of ${MAX_FILES} images can be uploaded at once.`,
        }
        return
      }

      const error = validateFile(file)
      const fileEntry = createFileEntry(file)

      if (error) {
        newErrors[fileEntry.id] = error
      } else {
        newFiles.push(fileEntry)
        const titleError = validateTitle(fileEntry.title)
        if (titleError) {
          newErrors[fileEntry.id] = titleError
        }
      }
    })

    setFiles((prev) => [...prev, ...newFiles])
    setErrors((prev) => ({ ...prev, ...newErrors }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChangeFiles(e.dataTransfer.files)
    }
  }

  const updateTitle = (id: string, title: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, title } : f)))
    setErrors((prev) => {
      const newErrors = { ...prev }
      const titleError = validateTitle(title)
      if (titleError) {
        newErrors[id] = titleError
      } else {
        delete newErrors[id]
      }
      return newErrors
    })
  }

  const removeFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
  }

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
    setErrors({})
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Reset file input
    }
  }

  const upload = async () => {
    if (files.length === 0) return
    const titleErrors: { [key: string]: ValidationError } = {}
    files.forEach((fileEntry) => {
      if (!errors[fileEntry.id]) {
        const titleError = validateTitle(fileEntry.title)
        if (titleError) {
          titleErrors[fileEntry.id] = titleError
        }
      }
    })

    if (Object.keys(titleErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...titleErrors }))
      return
    }

    setUploading(true)
    try {
      const uploadData = {
        files: files.filter((f) => !errors[f.id]).map((f) => f.file),
        titles: files.filter((f) => !errors[f.id]).map((f) => f.title),
        originalFileNames: files.filter((f) => !errors[f.id]).map((f) => f.originalFileName),
        mimeTypes: files.filter((f) => !errors[f.id]).map((f) => f.mimeType),
        fileSizes: files.filter((f) => !errors[f.id]).map((f) => f.file.size),
      }

      await ImagesAPI.bulkUpload(uploadData)

      files.forEach((f) => URL.revokeObjectURL(f.preview))
      setFiles([])
      setErrors({})
      if (fileInputRef.current) {
        fileInputRef.current.value = "" 
      }
      toast.success('Image Uploaded Successfully.')
      onUploaded()
    } catch (error) {
      console.error("Upload failed:", error)
      setErrors((prev) => ({
        ...prev,
        general: { type: "upload", message: "Failed to upload images" },
      }))
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const hasErrors = Object.keys(errors).length > 0
  const validFiles = files.filter((f) => !errors[f.id])

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Images</label>
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png"
            onChange={(e) => onChangeFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            ref={fileInputRef}
            title="Upload JPEG or PNG images"
          />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 text-gray-400 flex items-center justify-center">
              <Upload size={48} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop your images here, or <span className="text-blue-600 underline">browse</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Support for JPEG and PNG files up to 5MB each. Max 10 images at once.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* General Error Message */}
      {hasErrors && errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">!</div>
            Upload Error
          </div>
          <div className="text-sm text-red-700">{errors.general.message}</div>
        </div>
      )}

      {/* File Preview Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Images ({validFiles.length})
            </h3>
            <button
              onClick={clearAll}
              disabled={uploading}
              className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((fileEntry) => {
              const hasError = errors[fileEntry.id]

              return (
                <div
                  key={fileEntry.id}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                    hasError ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  {/* Image Preview */}
                  <div className="aspect-video bg-gray-100 relative">
                    {!hasError || hasError.type === "title" ? (
                      <Image
                        src={fileEntry.preview}
                        alt={fileEntry.title}
                        className="w-full h-full object-cover"
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-red-400">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">!</div>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(fileEntry.id)}
                      className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full w-7 h-7 flex items-center justify-center transition-all"
                    >
                      ×
                    </button>
                  </div>

                  {/* File Info and Title Input */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 truncate font-medium" title={fileEntry.originalFileName}>
                        {fileEntry.originalFileName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(fileEntry.file.size)} • {fileEntry.mimeType.split("/")[1].toUpperCase()}
                      </p>
                    </div>

                    {(!hasError || hasError.type === "title") && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={fileEntry.title}
                          onChange={(e) => updateTitle(fileEntry.id, e.target.value)}
                          className={`w-full ${hasError && hasError.type === "title" ? "border-red-500" : ""}`}
                          placeholder="Enter image title"
                        />
                        {hasError && hasError.type === "title" && (
                          <p className="text-xs text-red-600 mt-1">{hasError.message}</p>
                        )}
                      </div>
                    )}

                    {hasError && hasError.type !== "title" && (
                      <div className="text-xs text-red-600 bg-red-100 p-2 rounded-lg">
                        {hasError.message}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={upload}
            disabled={uploading || validFiles.length === 0 || validFiles.some((f) => !f.title.trim())}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {validFiles.length} Image{validFiles.length > 1 ? "s" : ""} (max {MAX_FILES})
              </>
            )}
          </button>

          <button
            onClick={clearAll}
            disabled={uploading}
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg font-semibold transition-all"
          >
            Clear All
          </button>
        </div>
      )}

      {validFiles.length === 0 && files.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300 flex items-center justify-center">
            <Upload size={48} />
          </div>
          <p className="text-lg font-medium">No images selected</p>
          <p className="text-sm mt-1">Choose images to get started</p>
        </div>
      )}
    </div>
  )
}