import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuthResponse } from "@/types/auth.types"

interface AuthState {
  accessToken: string | null
  user: {
    id: string
    email: string
    name: string
    phoneNumber?: string
  } | null
}

const initialState: AuthState = {
  accessToken: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Sets both accessToken and user object from AuthResponse.
     */
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      localStorage.setItem("accessToken", action.payload.accessToken)
    },

    /**
     * Updates access token only (used in token rotation).
     */
    updateToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      localStorage.setItem("accessToken", action.payload)
    },

    /**
     * Updates user object only.
     */
    setUser(state, action: PayloadAction<AuthState["user"]>) {
      state.user = action.payload
    },

    /**
     * Clears auth state and localStorage.
     */
    logout(state) {
      state.accessToken = null
      state.user = null
      localStorage.removeItem("accessToken")
    },
  },
})

export const { setCredentials, updateToken, setUser, logout } = authSlice.actions
export default authSlice.reducer