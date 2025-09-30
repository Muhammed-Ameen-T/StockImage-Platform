// hooks/useImages.ts
import { useState, useEffect, useRef } from "react" 
import useSWR from "swr"
import { ImagesAPI } from "@/services/imageApi"
import { ImageResponse, ListParams } from "@/types/image.types"

interface UseImagesParams extends Omit<ListParams, 'skip'> {
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useImages(params: UseImagesParams = {}) {
    const { limit = 8, search = "", sortBy = "order", sortOrder = "desc" } = params;
    
    const [images, setImages] = useState<ImageResponse["images"]>([]) 
    
    const prevParamsRef = useRef({ search, sortBy, sortOrder });

    const queryKey: [string, UseImagesParams] = ["/images/user", params]

    const fetcher = async ([_, query]: [string, UseImagesParams]): Promise<ImageResponse> => {
      const apiParams: ListParams = {
        skip: 0, 
        limit: query.limit,
        search: query.search,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      }
      const response = await ImagesAPI.list(apiParams)
      return {
        images: response.images,
        total: response.total,
      }
    }

    const { data, error, isLoading, mutate } = useSWR<ImageResponse, Error>(queryKey, fetcher, {
        revalidateOnFocus: false,
        onSuccess: (newData) => {
            const prevParams = prevParamsRef.current;
            const currentParams = { search, sortBy, sortOrder };
            
            const isFilterSortChange = 
                prevParams.search !== currentParams.search || 
                prevParams.sortBy !== currentParams.sortBy || 
                prevParams.sortOrder !== currentParams.sortOrder;

            if (isFilterSortChange) {
                setImages(newData.images);
            } else if (newData.images.length > images.length) {
                setImages(newData.images);
            } else {
                setImages(newData.images);
            }

            prevParamsRef.current = currentParams;
        },
    })
    
    const handleMutate = async () => {
      await mutate();
    }

    useEffect(() => {
      if (error) {
          console.error("Failed to fetch images:", error.message)
      }
    }, [error])

    return {
      images,
      total: data?.total ?? 0,
      error: error?.message,
      isLoading,
      mutate: handleMutate, 
      isInitialLoading: isLoading && images.length === 0 
    }
}