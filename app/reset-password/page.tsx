import { Suspense } from 'react'
import { ResetPasswordForm } from '@/app/dashboard/components/tabs/profile-subtabs/ResetPasswordForm'

function ResetPasswordContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-width-sm sm:max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
          <p className="text-sm text-gray-600">
            Use the link from your email to open this page, then choose a new password.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

