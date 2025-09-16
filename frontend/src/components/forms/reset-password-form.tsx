"use client"

import { useRouter } from "next/navigation"
import { useChangePassword } from "@/hooks/userAuth"
import { useState, FormEvent } from "react"
import FormInput from "@/components/ui/form-input"
import FormButton from "@/components/ui/form-button"
import { LockIcon, ShieldIcon } from "@/components/ui/form-icons"
import { toast } from "sonner"

interface ChangePasswordErrors {
  oldPassword?: string
  newPassword?: string
  [key: string]: string | undefined
}

export default function ResetPasswordForm() {
  const router = useRouter()
  const { submit, loading, errors, serverError } = useChangePassword()
  
  const [oldPassword, setOldPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await submit({ oldPassword, newPassword })
    if (result) {
      router.push("/dashboard")
      toast.success("Password updated successfully!")
    }
  }

  const typedErrors = errors as ChangePasswordErrors | undefined

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Current Password Field */}
      <FormInput
        label="Current Password"
        type="password"
        icon={<LockIcon />}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Enter your current password"
        error={typedErrors?.oldPassword}
        showPasswordToggle
        showPassword={showOldPassword}
        onTogglePassword={() => setShowOldPassword(!showOldPassword)}
        disabled={loading}
        required
      />

      {/* New Password Field */}
      <FormInput
        label="New Password"
        type="password"
        icon={<ShieldIcon />}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Create a strong new password"
        error={typedErrors?.newPassword}
        showPasswordToggle
        showPassword={showNewPassword}
        onTogglePassword={() => setShowNewPassword(!showNewPassword)}
        disabled={loading}
        required
      />

      {/* Password Requirements */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-start gap-2">
          <ShieldIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center gap-1">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-1">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                Include uppercase and lowercase letters
              </li>
              <li className="flex items-center gap-1">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                Include at least one number
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2">
            {/* <ErrorIcon className="flex-shrink-0" /> */}
            <p className="text-sm text-red-800" role="alert">
              {serverError}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <FormButton
        type="submit"
        loading={loading}
        loadingText="Updating password..."
        disabled={!oldPassword || !newPassword}
        icon={<ShieldIcon className="w-4 h-4" />}
      >
        Update Password
      </FormButton>

      {/* Security Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          After updating your password, you&lsquo;ll be redirected to the login page
        </p>
      </div>
    </form>
  )
}