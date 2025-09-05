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
                        <div className="flex items-center space-x-4">

                        </div>
                    </div>


            <DeleteEventsForm events={events} />
        </div>
    )
}