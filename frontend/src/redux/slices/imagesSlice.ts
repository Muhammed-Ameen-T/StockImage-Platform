// redux/slices/imagesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ImagesState {
  selectedIds: string[]
}

const initialState: ImagesState = { 
  selectedIds: [],
}

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload
    },
  },
})

export const { setSelectedIds } = imagesSlice.actions
export default imagesSlice.reducer