import { prisma } from '@/lib/prisma'
import UserCreateEventForm from '@/components/forms/UserCreateEventForm'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  return categories
}

export default async function CreateUserEventPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
              <span className="text-sm text-gray-500">
                Add your event details
              </span>
            </div>
          </div>
        </div>
      </div>

      <UserCreateEventForm categories={categories} />
    </div>
  )
}
