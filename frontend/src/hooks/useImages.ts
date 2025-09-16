// hooks/useImages.ts
import { useEffect } from "react"
import useSWR from "swr"
import { ImagesAPI } from "@/services/imageApi"
import { ImageResponse, ListParams } from "@/types/image.types"

export function useImages(params: ListParams = {}) {
  const queryKey: [string, ListParams] = ["/images/user", params]

  const fetcher = async ([_, query]: [string, ListParams]): Promise<ImageResponse> => {
    const response = await ImagesAPI.list(query)
    return {
      images: response.images,
      total: response.total,
    }
  }

  const { data, error, isLoading, mutate } = useSWR<ImageResponse, Error>(queryKey, fetcher)

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch images:", error.message)
    }
  }, [error])

  return {
    images: data?.images ?? [],
    total: data?.total ?? 0,
    error: error?.message,
    isLoading,
    mutate,
  }
}