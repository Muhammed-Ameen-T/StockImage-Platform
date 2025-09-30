// src/components/ui/ConfirmationModal.tsx
import { Modal } from "./Modal"
import { Button } from "./Button"
import Image from "next/image"
import React from "react"

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isConfirming: boolean
  title: string
  message: string | React.ReactNode
  confirmText: string
  imagePreviewUrl?: string
  imagePreviewAlt?: string
  error?: string | null
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isConfirming,
  title,
  message,
  confirmText,
  imagePreviewUrl,
  imagePreviewAlt,
  error,
}: ConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-md"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {imagePreviewUrl && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={imagePreviewUrl}
                alt={imagePreviewAlt || "Image preview"}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-medium">
              {message}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isConfirming}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-2"
          >
            {isConfirming ? `${confirmText}...` : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}