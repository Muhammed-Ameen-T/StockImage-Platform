import axios from "axios"
import { store } from "@/redux/store"
import { logout } from "@/redux/slices/authSlice"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
})

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(err)
  },
)

// Auth endpoints
export const AuthAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data).then((r) => r.data),
  register: (data: { email: string; phone: string; password: string }) =>
    api.post("/auth/register", data).then((r) => r.data),
  resetPassword: (data: { email: string; token: string; password: string }) =>
    api.post("/auth/reset-password", data).then((r) => r.data),
}

// Images endpoints
export const ImagesAPI = {
  list: () => api.get("/images").then((r) => r.data),
  bulkUpload: (formData: FormData) =>
    api.post("/images/bulk", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id: string, data: { title?: string; file?: File | null }) => {
    const form = new FormData()
    if (data.title) form.append("title", data.title)
    if (data.file) form.append("file", data.file)
    return api.put(`/images/${id}`, form).then((r) => r.data)
  },
  remove: (id: string) => api.delete(`/images/${id}`).then((r) => r.data),
  get: (id: string) => api.get(`/images/${id}`).then((r) => r.data),
  reorder: (ids: string[]) => api.post("/images/reorder", { ids }).then((r) => r.data),
}
