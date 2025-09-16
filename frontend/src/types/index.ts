export type AuthUser = {
  id: string
  email: string
  phone?: string
}

export type ImageItem = {
  _id: string
  title: string
  url: string
  originalFileName: string
  mimeType: string  
  fileSize: number
  order: number
  userId: string
  createdAt: string
  updatedAt?: string
}

export interface APIError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}