'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

interface UnauthorizedAccessProps {
  requiredRole?: string
  redirectPath?: string
}

export default function UnauthorizedAccess({
  requiredRole = 'ADMIN',
  redirectPath = '/events',
}: UnauthorizedAccessProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, logout } = useAuth()
  const [countdown, setCountdown] = useState(10)

  const urlRequiredRole = searchParams.get('role') || requiredRole
  const urlRedirectPath = searchParams.get('redirect') || redirectPath
  const reason = searchParams.get('reason') || 'Insufficient permissions'

  useEffect(() => {
    window.history.pushState(
      null,
      '',
      window.location.pathname + window.location.search
    )

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      window.history.pushState(
        null,
        '',
        window.location.pathname + window.location.search
      )

      alert(
        'Access denied. You cannot return to the previous page due to insufficient permissions.'
      )
    }

    window.addEventListener('popstate', handlePopState)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
      ) {
        event.preventDefault()
        alert('Navigation is disabled on this page.')
      }

      if (event.key === 'Backspace' && event.target === document.body) {
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // useEffect(() => {
  //     const timer = setInterval(() => {
  //         setCountdown((prev) => {
  //             if (prev <= 1) {
  //                 setTimeout(() => {
  //                     router.push(urlRedirectPath);
  //                 }, 0);
  //                 return 0;
  //             }
  //             return prev - 1;
  //         });
  //     }, 1000);
  //
  //     return () => clearInterval(timer);
  // }, [router, urlRedirectPath]);

  const handleGoHome = () => {
    router.push(urlRedirectPath)
  }

  const handleSignOut = async () => {
    await logout()
  }

  const getRoleDisplayText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator'
      case 'USER':
        return 'User'
      default:
        return role
    }
  }

  const getReasonIcon = (reason: string) => {
    if (reason.includes('revoked') || reason.includes('expired')) {
      return (
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      )
    }

    return (
      <svg
        className="h-6 w-6 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-6">
            {getReasonIcon(reason)}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>

            <div className="mb-6 space-y-2">
              <p className="text-gray-600">{reason}</p>
              <p className="text-sm text-gray-500">
                Required role:{' '}
                <span className="font-semibold text-red-600">
                  {getRoleDisplayText(urlRequiredRole)}
                </span>
                {user && (
                  <span className="block mt-1">
                    Your current role:{' '}
                    <span className="font-semibold">
                      {getRoleDisplayText(user.role)}
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/*<div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">*/}
            {/*    <p className="text-sm text-yellow-800">*/}
            {/*        Redirecting in <span className="font-bold">{countdown}</span> seconds*/}
            {/*    </p>*/}
            {/*    <div className="w-full bg-yellow-200 rounded-full h-1.5 mt-2">*/}
            {/*        <div*/}
            {/*            className="bg-yellow-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"*/}
            {/*            style={{ width: `${((10 - countdown) / 10) * 100}%` }}*/}
            {/*        ></div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Go to Home Page
              </button>

              {user && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Note:</span> If you believe this
                is an error, please contact the administrator to verify your
                permissions.
              </p>
            </div>

            {reason.includes('revoked') && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-800">
                  <span className="font-semibold">Security Notice:</span> Your
                  access permissions have been modified. Please sign in again if
                  you need to access protected resources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
