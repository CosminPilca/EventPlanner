import { prisma } from '@/lib/prisma'
import DeleteEventsForm from '@/components/forms/DeleteEventForm'

async function getAllEvents() {
    return await prisma.event.findMany({
        include: {
            category: {
                select: { name: true }
            },
            organizer: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export default async function DeleteEventsPage() {
    const events = await getAllEvents()

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
                            <span className="text-sm text-gray-600">Delete Events</span>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteEventsForm events={events} />
        </div>
    )
}