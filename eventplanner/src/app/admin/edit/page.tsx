import { prisma } from '@/lib/prisma'
import EditEventsForm from '@/components/forms/EditEventForm'

async function getAllEvents() {
    return await prisma.event.findMany({
        include: {
            category: { select: { name: true } },
            organizer: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    })
}

async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })
}

async function getAdminUsers() {
    return await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true, email: true }
    })
}

export default async function EditEventsPage() {
    const [events, categories, admins] = await Promise.all([
        getAllEvents(),
        getCategories(),
        getAdminUsers()
    ])

    return (
        <div className="min-h-screen bg-gray-50">
            <EditEventsForm events={events} categories={categories} admins={admins} />
        </div>
    )
}
