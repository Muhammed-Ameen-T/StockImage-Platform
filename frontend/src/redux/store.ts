"use client"

import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import authReducer from "./slices/authSlice"
import imagesReducer from "./slices/imagesSlice"
import loadingReducer from "./slices/loadingSlice"

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "user"],
}

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  images: imagesReducer,
  loading: loadingReducer,
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector