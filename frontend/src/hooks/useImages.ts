"use client"

import useSWR from "swr"
import { ImagesAPI } from "@/services/api"
import type { ImageItem } from "@/types"

export function useImages() {
  const { data, error, isLoading, mutate } = useSWR<ImageItem[]>("/images", () => ImagesAPI.list())
  return { images: data || [], error, isLoading, mutate }
}

export function useImage(id: string) {
  const key = id ? `/images/${id}` : null
  const { data, error, isLoading, mutate } = useSWR<ImageItem | null>(key, () =>
    id ? ImagesAPI.get(id) : Promise.resolve(null),
  )
  return { image: data || null, error, isLoading, mutate }
}
