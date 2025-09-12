import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ImageItem } from "@/types"

type ImagesState = {
  selectedIds: string[]
  reorderList: ImageItem[]
}

const initialState: ImagesState = {
  selectedIds: [],
  reorderList: [],
}

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setSelectedIds: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload
    },
    setReorderList: (state, action: PayloadAction<ImageItem[]>) => {
      state.reorderList = action.payload
    },
    moveItem: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const list = [...state.reorderList]
      const [moved] = list.splice(fromIndex, 1)
      list.splice(toIndex, 0, moved)
      state.reorderList = list
    },
    clearWorking: (state) => {
      state.reorderList = []
      state.selectedIds = []
    },
  },
})

export const { setSelectedIds, setReorderList, moveItem, clearWorking } = imagesSlice.actions
export default imagesSlice.reducer
