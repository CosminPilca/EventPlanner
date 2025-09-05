import EditEventForm from '@/components/forms/UserEditForm'
import { prisma } from '@/lib/prisma'

async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: { category: true }
    })
    return event || null
}

async function getCategories() {
    return (await prisma.category.findMany({ orderBy: { name: 'asc' } })) || []
}

interface EditEventPageProps {
    params: { id: string }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const { id } = params

    const [event, categories] = await Promise.all([
        getEvent(id),
        getCategories()
    ])

    if (!event) {
        return (
            <div className="text-center py-16">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h1>
                <p className="text-gray-600 mb-6">The event you are trying to edit does not exist.</p>
            </div>
        )
    }

    return <EditEventForm event={event} categories={categories} />
}
