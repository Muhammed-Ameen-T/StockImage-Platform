import { ImageItem } from "./index"

export interface ImageResponse {
  images: ImageItem[]
  total: number
}

export interface ListParams {
  skip?: number 
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  append?: boolean 
}
