"use client"

import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import authReducer from "./slices/authSlice"
import imagesReducer from "./slices/imagesSlice"

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"],
}

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  images: imagesReducer,
}

export const store = configureStore({
  reducer: rootReducer as any,
  middleware: (getDefault: any) =>
    getDefault({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
