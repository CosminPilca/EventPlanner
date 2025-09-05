import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Administrative panel for managing the application',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name || user.email}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Admin Access
              </span>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
