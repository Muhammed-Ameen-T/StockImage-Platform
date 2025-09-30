"use client"

import { useState, useRef, useEffect } from "react" 
import Link from "next/link"
import { useImages } from "@/hooks/useImages"
import { ImagesAPI } from "@/services/imageApi"
import { ImageCard } from "@/components/ui/ImageCard"
import { Button } from "@/components/ui/Button"
import { FilterBar } from "@/components/ui/FilterBar"
import { SortDropdown } from "@/components/ui/SortDropdown"
import { ConfirmationModal } from "@/components/ui/ConfirmationModal"
import { EditImageModal } from "@/components/ui/EditImageModal"
import { ViewImageModal } from "@/components/ui/ViewImageModal"
import { ImageItem } from "@/types"
import Providers from "@/components/layout/providers"
import Protected from "@/components/layout/protected"
import { toast } from "sonner"

const initialLimit = 8
const loadMoreLimit = 4

export default function Dashboard() {
  const [limit, setLimit] = useState(initialLimit) 
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("order")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  const { images, total, isLoading, error, mutate } = useImages({ 
    limit, 
    search,
    sortBy,
    sortOrder,
  })
  
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [errorState, setError] = useState<string | null>(null)
  const dragItem = useRef<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const hasActiveFilters = search !== "" || sortBy !== "order" || sortOrder !== "desc"
  

  const totalLoadedImages = images.length
  const hasMore = totalLoadedImages < total

  const handleLoadMore = () => {
    setIsLoadMoreLoading(true);
    setLimit(prev => prev + loadMoreLimit);
  }

  useEffect(() => {
    if (limit !== initialLimit && (search !== "" || sortBy !== "order" || sortOrder !== "desc")) {
      setLimit(initialLimit);
    }
  }, [search, sortBy, sortOrder]);


  useEffect(() => {
      if (totalLoadedImages >= limit && isLoadMoreLoading) {
          setIsLoadMoreLoading(false);
      }
      if (!hasMore && isLoadMoreLoading) {
        setIsLoadMoreLoading(false);
      }
  }, [totalLoadedImages, limit, isLoadMoreLoading, hasMore]);


  const handleClearFilters = () => {
    setSearch("")
    setSortBy("order")
    setSortOrder("desc")
    setLimit(initialLimit) 
  }

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
      toast.success("Image deleted successfully")
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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (sortBy !== 'order' || search !== '') {
        e.preventDefault();
        return;
    }
    dragItem.current = id
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (sortBy === 'order' && search === '') {
        e.dataTransfer.dropEffect = "move"
        setDragOverId(id)
    }
  }

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (sortBy === 'order' && search === '') {
        setDragOverId(id)
    }
  }

  const handleDragLeave = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (sortBy === 'order' && search === '' && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverId(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, dropId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (sortBy !== 'order' || search !== '') {
        setDragOverId(null);
        dragItem.current = null;
        return;
    }

    const draggedId = dragItem.current;
    if (!draggedId || draggedId === dropId || !images) {
      setDragOverId(null);
      dragItem.current = null;
      return;
    }

    const dragIndex = images.findIndex((i) => i._id === draggedId);
    const dropIndex = images.findIndex((i) => i._id === dropId);

    if (dragIndex === -1 || dropIndex === -1) {
      setDragOverId(null);
      dragItem.current = null;
      return;
    }

    const tempImages = [...images];
    const [draggedImage] = tempImages.splice(dragIndex, 1);
    tempImages.splice(dropIndex, 0, draggedImage);

    let newPreviousImage, newNextImage;
    if (dropIndex > 0) {
      newPreviousImage = tempImages[dropIndex - 1];
    }
    if (dropIndex < tempImages.length - 1) {
      newNextImage = tempImages[dropIndex + 1];
    }

    const previousOrder = newPreviousImage?.order;
    const nextOrder = newNextImage?.order;

    try {
      await ImagesAPI.reorder({
        imageId: draggedId,
        previousOrder,
        nextOrder,
      });
      toast.success("Image reordered successfully");

      await mutate(); 
    } catch (err) {
      setError("Failed to reorder images");
      toast.error("Failed to reorder image");
    }

    dragItem.current = null;
    setDragOverId(null);
  };


  const handleDragEnd = () => {
    dragItem.current = null
    setDragOverId(null)
  }
  
  const ClearFiltersIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )

  const LoadingIcon = () => (
    <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

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
                  setLimit(initialLimit) 
                }}
                initialSortBy={sortBy}
                initialSortOrder={sortOrder}
              />
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

          {isLoading && limit === initialLimit ? (
            <div className="py-10 text-sm text-muted-foreground">Loading images…</div>
          ) : images.length === 0 && !isLoading ? ( 
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-gray-200 text-center space-y-4 shadow-inner">
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
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-800">No images found</p>
                <p className="text-sm text-gray-500 max-w-sm">
                  {hasActiveFilters ? "Try adjusting your filters or search terms." : "It looks like your gallery is empty. Start by uploading your first image to get started."}
                </p>
              </div>
              {!hasActiveFilters && (
                <Link href="/upload" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                  Upload Your First Image
                </Link>
              )}
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
                    draggable={sortBy === 'order' && search === ''}
                    onDragStart={sortBy === 'order' && search === '' ? (e) => handleDragStart(e, img._id) : undefined}
                    onDragOver={sortBy === 'order' && search === '' ? (e) => handleDragOver(e, img._id) : undefined}
                    onDrop={sortBy === 'order' && search === '' ? (e) => handleDrop(e, img._id) : undefined}
                    onDragEnter={sortBy === 'order' && search === '' ? (e) => handleDragEnter(e, img._id) : undefined}
                    onDragLeave={sortBy === 'order' && search === '' ? (e) => handleDragLeave(e, img._id) : undefined}
                    onDragEnd={sortBy === 'order' && search === '' ? handleDragEnd : undefined}
                    isDraggingOver={dragOverId === img._id}
                    isReorderDisabled={sortBy !== 'order' || search !== ''}
                  />
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={isLoadMoreLoading}
                    leftIcon={isLoadMoreLoading ? <LoadingIcon /> : null}
                    className="shadow-md"
                  >
                    {isLoadMoreLoading ? "Loading..." : `Load More (${loadMoreLimit} of ${total - totalLoadedImages})`}
                  </Button>
                </div>
              )}

              {!hasMore && total > 0 && (
                <div className="mt-8 text-center text-sm text-gray-500">
                  You&lsquo;ve viewed all {total} images.
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-600">
                  Showing {totalLoadedImages} of {total} results
              </div>
            </>
          )}

          {selectedImage && (
            <>
              <ViewImageModal
                isOpen={isViewModalOpen}
                onClose={handleCloseModals}
                item={selectedImage}
              />
              <EditImageModal
                isOpen={isEditModalOpen}
                onClose={handleCloseModals}
                item={selectedImage}
                onUpdated={handleImageUpdated}
                setError={setError}
              />
              <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleConfirmDelete}
                isConfirming={isDeleting}
                title="Delete Image"
                message={
                  <>
                    Are you sure you want to delete this image?
                    <p className="text-sm text-gray-500 truncate mt-1">
                      &quot;{selectedImage.title}&quot;
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      This action cannot be undone.
                    </p>
                  </>
                }
                confirmText="Delete Image"
                imagePreviewUrl={selectedImage.url}
                imagePreviewAlt={selectedImage.title}
                error={errorState}
              />
            </>
          )}
        </main>
      </Protected>
    </Providers>
  )
}