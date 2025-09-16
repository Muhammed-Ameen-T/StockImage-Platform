"use client"

import { useState, ChangeEvent, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSendOtp, useVerifyOtp } from "@/hooks/userAuth"
import { EmailIcon, EyeIcon, EyeOffIcon, LockIcon, OtpIcon, PhoneIcon, UserIcon } from "../ui/form-icons"
import { toast } from "sonner"

type FormFieldName = 'name' | 'email' | 'phone' | 'password' | 'otp';

export default function RegisterForm() {
  const router = useRouter()

  const {
    submit: sendOtp,
    loading: sendingOtp,
    serverError: sendOtpServerError,
    errors: sendOtpErrors,
  } = useSendOtp()

  const {
    submit: verifyOtp,
    loading: verifyingOtp,
    serverError: verifyOtpServerError,
    errors: verifyOtpErrors,
  } = useVerifyOtp()

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [otp, setOtp] = useState<string>("")
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleSendOtp = async () => {
    const res = await sendOtp({ name, email, phone, password })
    if (res){
      setOtpSent(true)
      toast.success("OTP sent successfully!")
    } 
  }

  const handleVerifyOtp = async () => {
    const res = await verifyOtp({ name, email, phone, password, otp })
    if (res){
      router.push("/dashboard")
      toast.success("User Registration successful!")
    } 
  }

  const renderField = (
    label: string,
    type: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    icon: ReactNode,
    fieldName: FormFieldName,
    disabled = false
  ) => {
    const hasError = sendOtpErrors?.[fieldName] || verifyOtpErrors?.[fieldName]
    
    return (
      <div className="space-y-0">
        <label className="block text-sm font-medium text-gray-700">
          {label}<span className="ml-1 text-red-500 text-xl">*</span>   
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
          <input
            type={type === "password" && showPassword ? "text" : type}
            className={`
              block w-full pl-10 ${type === "password" ? "pr-10" : "pr-3"} py-3 border rounded-xl text-sm
              transition-all duration-200 ease-in-out
              placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              hover:border-gray-300
              ${hasError 
                ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-200 bg-white hover:bg-gray-50/50 focus:bg-white'
              }
              ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
          {type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>
        {hasError && (
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-red-600">{hasError}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {!otpSent ? (
        <>
          {/* Registration Fields */}
          {renderField(
            "Full Name",
            "text",
            name,
            (e) => setName(e.target.value),
            "Enter your full name",
            <UserIcon />,
            "name",
            sendingOtp
          )}

          {renderField(
            "Email address",
            "email",
            email,
            (e) => setEmail(e.target.value),
            "Enter your email",
            <EmailIcon />,
            "email",
            sendingOtp
          )}

          {renderField(
            "Phone number",
            "tel",
            phone,
            (e) => setPhone(e.target.value),
            "+91 98765 43210",
            <PhoneIcon />,
            "phone",
            sendingOtp
          )}

          {renderField(
            "Password",
            "password",
            password,
            (e) => setPassword(e.target.value),
            "Create a strong password",
            <LockIcon />,
            "password",
            sendingOtp
          )}

          {/* Server Error */}
          {sendOtpServerError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800" role="alert">
                  {sendOtpServerError}
                </p>
              </div>
            </div>
          )}

          {/* Sign Up Button */}
          <button
            type="button"
            disabled={sendingOtp || !name || !email || !phone || !password}
            onClick={handleSendOtp}
            className={`
              w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
              ${sendingOtp || !name || !email || !phone || !password
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {sendingOtp ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span>Sending OTP...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Create Account</span>
              </div>
            )}
          </button>
        </>
      ) : (
        <>
          {/* OTP Verification Step */}
          <div className="text-center mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">OTP sent successfully!</h3>
            <p className="text-xs text-blue-700">
              Please check your email and phone for the verification code
            </p>
          </div>

          {renderField(
            "Enter verification code",
            "text",
            otp,
            (e) => setOtp(e.target.value),
            "123456",
            <OtpIcon />,
            "otp",
            verifyingOtp
          )}

          {/* Server Error */}
          {verifyOtpServerError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800" role="alert">
                  {verifyOtpServerError}
                </p>
              </div>
            </div>
          )}

          {/* Verify Button */}
          <button
            type="button"
            disabled={verifyingOtp || !otp}
            onClick={handleVerifyOtp}
            className={`
              w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-green-500/20
              ${verifyingOtp || !otp
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {verifyingOtp ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Verify & Register</span>
              </div>
            )}
          </button>

          {/* Back to edit details */}
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            disabled={verifyingOtp}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50"
          >
            ← Back to edit details
          </button>
        </>
      )}
    </form>
  )
}