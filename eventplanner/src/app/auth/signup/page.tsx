import SignUpForm from '@/components/forms/SignUpForm'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-theme-primary">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-theme-primary">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-theme-secondary">
            Join us today and start managing your events
          </p>
        </div>

        <div className="mt-8">
          <div className="card rounded-lg shadow-sm border border-theme-primary p-6">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="h-10 bg-theme-secondary rounded animate-pulse" />
                  <div className="h-10 bg-theme-secondary rounded animate-pulse" />
                  <div className="h-10 bg-theme-secondary rounded animate-pulse" />
                  <div className="h-10 bg-theme-secondary rounded animate-pulse" />
                </div>
              }
            >
              <SignUpForm />
            </Suspense>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-theme-secondary">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="font-medium hover:underline theme-transition"
                style={{ color: 'var(--color-primary)' }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
