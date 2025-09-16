import axios from "axios"
import { store } from "@/redux/store"
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice"
import { updateToken, logout } from "@/redux/slices/authSlice"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
})

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading())

    const accessToken = store.getState().auth.accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    store.dispatch(stopLoading())
    return Promise.reject(error)
  }
)

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading())

    const newAccessToken = response.headers["x-access-token"]
    if (newAccessToken) {
      store.dispatch(updateToken(newAccessToken))
    }

    return response
  },
  (error) => {
    store.dispatch(stopLoading())

    if (!error.response) {
      console.error("Network error")
      return Promise.reject(error)
    }

    const { status, data } = error.response

    if (status === 401 && data?.message === "Invalid or expired refresh token") {
      store.dispatch(logout())
    }

    return Promise.reject(error)
  }
)

export default api