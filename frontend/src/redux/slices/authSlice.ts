import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthUser } from "@/types"

type AuthState = {
  token: string | null
  user: AuthUser | null
}

const initialState: AuthState = {
  token: null,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logout: (state) => {
      state.token = null
      state.user = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
