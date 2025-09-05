import DatabaseStatus from '@/components/UI/DatabaseStatus'
import { getAdminStats, testDatabaseConnection } from '@/utils/database'
import AdminLinkCard from '@/components/UI/AdminLinkCard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [stats, dbStatus] = await Promise.all([
    getAdminStats(),
    testDatabaseConnection(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-8">
        <div
          className={`p-4 rounded-lg border-2 ${
            dbStatus.connected
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Database Status:{' '}
                {dbStatus.connected ? ' Connected' : ' Disconnected'}
              </h3>
              {dbStatus.connected && (
                <p className="text-sm mt-1">
                  SQLite Version: {dbStatus.version}
                </p>
              )}
              {dbStatus.error && (
                <p className="text-sm mt-1">Error: {dbStatus.error}</p>
              )}
            </div>
            <DatabaseStatus />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Events</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.eventCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats.userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.categoryCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminLinkCard
          href="/admin/create"
          title="Create New Event"
          description="Add a new event to the platform"
          variant="green"
        />
        <AdminLinkCard
          href="/admin/categories"
          title="Manage Categories"
          description="Add or edit event categories"
          variant="blue"
        />
        <AdminLinkCard
          href="/admin/edit"
          title="Edit Events"
          description="Edit existing events"
          variant="purple"
        />
        <AdminLinkCard
          href="/admin/delete"
          title="Delete Events"
          description="Delete existing events"
          variant="red"
        />
      </div>
    </div>
  )
}
