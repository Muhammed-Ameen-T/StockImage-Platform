import api from "@/config/axios.config"
import { ERROR_MESSAGES } from "@/constants/auth.messages"
import { ImageResponse, ListParams } from "@/types/image.types"
import { handleAxiosError } from "@/utils/exios-error-handler"

export const ImagesAPI = {
  /**
   * Fetches all images for the authenticated user.
   */
  list: async (params: ListParams = {}): Promise<ImageResponse> => {
    try {
      const {
        skip = 0,
        limit = 8,
        search = "",
        sortBy = "order",
        sortOrder = "desc",
      } = params

      const query = new URLSearchParams()
      query.append("skip", skip.toString())
      query.append("limit", limit.toString())
      query.append("search", search.trim())
      query.append("sortBy", sortBy)
      query.append("sortOrder", sortOrder)

      const response = await api.get(`/images/user?${query.toString()}`)
      console.log("🚀 ~ response:", response)
      return response.data.data as ImageResponse
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.BULK_UPLOAD_FAILED)
    }
  },

  /**
   * Uploads multiple images with titles.
   * @param formData - FormData containing files and titles[]
   */
  bulkUpload: async (data: {
    files: File[]
    titles: string[]
    originalFileNames: string[]
    mimeTypes: string[]
    fileSizes: number[]
  }): Promise<void> => {
    try {
      const formData = new FormData()

      data.files.forEach((file, index) => {
        formData.append("files", file)
        formData.append("titles", data.titles[index]) 
        formData.append("originalFileNames", data.originalFileNames[index])
        formData.append("mimeTypes", data.mimeTypes[index])
        formData.append("fileSizes", data.fileSizes[index].toString())
      })

      const response = await api.post("/images/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (!response.data?.success) {
        throw new Error(response.data?.message || ERROR_MESSAGES.BULK_UPLOAD_FAILED)
      }
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.BULK_UPLOAD_FAILED)
    }
  },

  /**
   * Updates a single image's title or file.
   * @param id - Image ID
   * @param data - Title and/or file
   */
  update: async (
    id: string,
    data: {
      title: string 
      file?: File | null
      originalFileName?: string
      mimeType?: string
      fileSize?: number
    }
  ): Promise<ImageResponse> => {
    try {
      const formData = new FormData()

      formData.append("title", data.title)

      if (data.file) {
        formData.append("file", data.file)

        if (data.originalFileName) {
          formData.append("originalFileName", data.originalFileName)
        }

        if (data.mimeType) {
          formData.append("mimeType", data.mimeType)
        }

        if (data.fileSize !== undefined) {
          formData.append("fileSize", data.fileSize.toString())
        }
      }

      const response = await api.patch(`/images/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      return response.data.data
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FAILED_UPDATE_FAILED)
    }
  },

  /**
   * Deletes an image by ID.
   * @param id - Image ID
   */
  remove: async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/images/delete/${id}`)
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Image deletion failed")
      }
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FAILED_DELETE_IMAGE)
    }
  },

  /**
   * Fetches a single image by ID.
   * @param id - Image ID
   */
  get: async (id: string): Promise<ImageResponse> => {
    try {
      const response = await api.get(`/images/${id}`)
      return response.data.data
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FAILED_FETCH_IMAGE)
    }
  },

  /**
   * Reorders images based on drag-and-drop logic.
   * @param payload - Contains imageId, previousOrder, nextOrder
   */
  reorder: async (payload: {
    imageId: string
    previousOrder?: number
    nextOrder?: number
  }): Promise<void> => {
    try {
      const response = await api.patch("/images/reorder", payload)
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Image reorder failed")
      }
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FAILED_REORDER_IMAGE)
    }
  },
}
