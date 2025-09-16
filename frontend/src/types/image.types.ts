import { ImageItem } from "./index"

export interface ImageResponse {
  images: ImageItem[]
  total: number
}

export type ListParams = {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}