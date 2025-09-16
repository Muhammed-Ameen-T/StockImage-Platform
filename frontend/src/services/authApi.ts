import api from "@/config/axios.config"
import { USER_AUTH_ENDPOINTS } from "@/constants/apiEndPoint"
import { AUTH_MESSAGES } from "@/constants/auth.messages"
import { AuthResponse } from "@/types/auth.types"
import { handleAxiosError } from "@/utils/exios-error-handler"

export const AuthAPI = {
  /**
   * Sends OTP to user's email for registration.
   */
  sendOtp: async (email: string): Promise<void> => {
    try {
      const response = await api.post(USER_AUTH_ENDPOINTS.sendOtp, { email })
      if (!response.data?.success) {
        throw new Error(response.data?.message || AUTH_MESSAGES.OTP_FAILED)
      }
    } catch (error) {
      handleAxiosError(error, AUTH_MESSAGES.OTP_FAILED)
    }
  },

  /**
   * Verifies OTP and completes user registration.
   */
  verifyOtp: async (
    name: string,
    email: string,
    otp: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post(USER_AUTH_ENDPOINTS.verifyOtp, {
        name,
        email,
        otp,
        password,
      })

      if (!response.data?.success) {
        throw new Error(response.data?.message || AUTH_MESSAGES.INVALID_OTP)
      }

      return response.data.data
    } catch (error) {
      handleAxiosError(error, AUTH_MESSAGES.INVALID_OTP)
    }
  },

  /**
   * Logs in user with email and password.
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post(USER_AUTH_ENDPOINTS.login, { email, password })

      if (!response.data?.success) {
        throw new Error(response.data?.message || AUTH_MESSAGES.LOGIN_FAILED)
      }

      return response.data.data
    } catch (error) {
      handleAxiosError(error, AUTH_MESSAGES.LOGIN_FAILED)
    }
  },

  /**
   * Changes user's password.
   * @param oldPassword - Current password
   * @param newPassword - New password to be set
   */
  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const response = await api.patch(USER_AUTH_ENDPOINTS.changePassword, {
        oldPassword,
        newPassword,
      })

      if (!response.data?.success) {
        throw new Error(response.data?.message || AUTH_MESSAGES.CHANGE_PASSWORD_FAILED)
      }
    } catch (error) {
      handleAxiosError(error, AUTH_MESSAGES.CHANGE_PASSWORD_FAILED)
    }
  },

  /**
   * Logs out the user and clears session.
   */
  logout: async (): Promise<void> => {
    try {
      const response = await api.post(USER_AUTH_ENDPOINTS.logout)

      if (!response.data?.success) {
        throw new Error(response.data?.message || AUTH_MESSAGES.LOGOUT_FAILED)
      }
    } catch (error) {
      handleAxiosError(error, AUTH_MESSAGES.LOGOUT_FAILED)
    }
  },
}
