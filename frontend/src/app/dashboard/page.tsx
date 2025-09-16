"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useImages } from "@/hooks/useImages"
import { ImagesAPI } from "@/services/imageApi"
import { ImageCard } from "@/components/ui/ImageCard"
import { Button } from "@/components/ui/Button"
import { FilterBar } from "@/components/ui/FilterBar"
import { SortDropdown } from "@/components/ui/SortDropdown"
import { Pagination } from "@/components/ui/Pagination"
import { Modal } from "@/components/ui/Modal"
import { EditImageModal } from "@/components/ui/EditImageModal"
import { ViewImageModal } from "@/components/ui/ViewImageModal"
import { ImageItem } from "@/types"
import Providers from "@/components/layout/providers"
import Protected from "@/components/layout/protected"
import Image from "next/image"

export default function Dashboard() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("order")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const itemsPerPage = 8
  const { images, total, isLoading, error, mutate } = useImages({
    page,
    limit: itemsPerPage,
    search,
    sortBy,
    sortOrder,
  })
  const [errorState, setError] = useState<string | null>(null)
  const dragItem = useRef<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  // Modal states
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if any filters are applied
  const hasActiveFilters = search !== "" || sortBy !== "order" || sortOrder !== "desc"

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("order"); 
    setSortOrder("desc"); 
    setPage(1); 
  };

  // Modal handlers
  const handleViewImage = (image: ImageItem) => {
    setSelectedImage(image)
    setIsViewModalOpen(true)
  }

  const handleEditImage = (image: ImageItem) => {
    setSelectedImage(image)
    setIsEditModalOpen(true)
  }

  const handleDeleteImage = (image: ImageItem) => {
    setSelectedImage(image)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedImage) return
    
    setIsDeleting(true)
    setError(null)
    try {
      await ImagesAPI.remove(selectedImage._id)
      await mutate()
      setIsDeleteModalOpen(false)
      setSelectedImage(null)
    } catch (err) {
      setError("Failed to delete image. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModals = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
    setSelectedImage(null)
    setError(null)
  }

  const handleImageUpdated = async () => {
    await mutate()
    handleCloseModals()
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    dragItem.current = id
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverId(id)
  }

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverId(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, dropId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!dragItem.current || dragItem.current === dropId) {
      setDragOverId(null)
      dragItem.current = null
      return
    }

    const dragIndex = images.findIndex((i) => i._id === dragItem.current)
    const dropIndex = images.findIndex((i) => i._id === dropId)

    const previousImage = dropIndex > 0 ? images[dropIndex - 1] : undefined
    const nextImage = dropIndex < images.length - 1 ? images[dropIndex + 1] : undefined

    try {
      const response = await ImagesAPI.reorder({
        imageId: dragItem.current,
        previousOrder: previousImage?.order,
        nextOrder: nextImage?.order,
      })
      await mutate()
    } catch (err) {
      console.error("Reorder failed:", err)
      setError("Failed to reorder images")
    }

    dragItem.current = null
    setDragOverId(null)
  }

  const handleDragEnd = (e: React.DragEvent, id: string) => {
    console.log("Drag ended:", id)
    dragItem.current = null
    setDragOverId(null)
  }

  // Clear filters icon
  const ClearFiltersIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )

  return (
    <Providers>
      <Protected>
        <main className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl font-semibold">Your Images</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <FilterBar onFilter={setSearch} initialSearch={search} />
              <SortDropdown
                onSort={(newSortBy, newSortOrder) => {
                  setSortBy(newSortBy)
                  setSortOrder(newSortOrder)
                  setPage(1)
                }}
                initialSortBy={sortBy}
                initialSortOrder={sortOrder}
              />
              {/* Clear Filters Button - Only show when filters are active */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleClearFilters}
                  leftIcon={<ClearFiltersIcon />}
                  className="shadow-sm hover:bg-gray-50"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Optional: Show active filters indicator */}
          {hasActiveFilters && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Active filters:</span>
              <div className="flex items-center gap-2">
                {search && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {`Search: "${search}"`}
                  </span>
                )}
                {sortBy !== "order" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Sort: {sortBy}
                  </span>
                )}
                {sortOrder !== "desc" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </span>
                )}
              </div>
            </div>
          )}

          {(error || errorState) && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error || errorState}
            </div>
          )}

          {isLoading ? (
            <div className="py-10 text-sm text-muted-foreground">Loading images…</div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-gray-200 text-center space-y-4 shadow-inner">
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-800">No images found</p>
                <p className="text-sm text-gray-500 max-w-sm">
                  It looks like your gallery is empty. Start by uploading your first image to get started.
                </p>
              </div>

              {/* Call-to-action Button */}
              <Link href="/upload" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                Upload Your First Image
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {images.map((img) => (
                  <ImageCard
                    key={img._id}
                    item={img}
                    onView={() => handleViewImage(img)}
                    onEdit={() => handleEditImage(img)}
                    onDelete={() => handleDeleteImage(img)}
                    onDragStart={(e) => handleDragStart(e, img._id)}
                    onDragOver={(e) => handleDragOver(e, img._id)}
                    onDrop={(e) => handleDrop(e, img._id)}
                    onDragEnter={(e) => handleDragEnter(e, img._id)}
                    onDragLeave={(e) => handleDragLeave(e, img._id)}
                    onDragEnd={(e) => handleDragEnd(e, img._id)}
                    isDraggingOver={dragOverId === img._id}
                  />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={(newPage) => {
                  setPage(newPage)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              />
            </>
          )}

          {/* Centralized Modals */}
          {selectedImage && (
            <>
              {/* View Image Modal */}
              <ViewImageModal
                isOpen={isViewModalOpen}
                onClose={handleCloseModals}
                item={selectedImage}
              />

              {/* Edit Image Modal */}
              <EditImageModal
                isOpen={isEditModalOpen}
                onClose={handleCloseModals}
                item={selectedImage}
                onUpdated={handleImageUpdated}
                setError={setError}
              />

              {/* Delete Confirmation Modal */}
              <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModals}
                title="Delete Image"
                className="max-w-md"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={selectedImage.url}
                        alt={selectedImage.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium">
                        Are you sure you want to delete this image?
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        &quot;{selectedImage.title}&quot;
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  
                  {errorState && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{errorState}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="secondary"
                      onClick={handleCloseModals}
                      disabled={isDeleting}
                      className="px-4 py-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                      className="px-4 py-2"
                    >
                      {isDeleting ? "Deleting..." : "Delete Image"}
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          )}
        </main>
      </Protected>
    </Providers>
  )
}