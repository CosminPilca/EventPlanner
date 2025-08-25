import { prisma } from '@/lib/prisma'
import CreateEventForm from '../../../components/forms/CreateEventForm'

async function getCategories() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })
    return categories
}

async function getAdminUsers() {
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true, email: true }
    })
    return admins
}

export default async function CreateEventPage() {
    const [categories, admins] = await Promise.all([
        getCategories(),
        getAdminUsers()
    ])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">Event Planner</h1>
                            <span className="text-sm text-gray-500">Admin</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Create Event</span>
                        </div>
                    </div>
                </div>
            </div>

            <CreateEventForm categories={categories} admins={admins} />
        </div>
    )
}