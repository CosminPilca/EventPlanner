import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            category: true,
            organizer: {
                select: { name: true, email: true }
            }
        }
    })

    if (!event) notFound()
    return event
}

export default async function EventDetailPage({
                                                  params
                                              }: {
    params: { id: string }
}) {
    const event = await getEvent(params.id)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {event.imageUrl && (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-64 object-cover rounded-lg mb-8"
                    />
                )}

                <div className="mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {event.category.name}
          </span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                        <div className="space-y-2 text-gray-600">
                            <div> Starts: {new Date(event.startsAt).toLocaleString()}</div>
                            <div> Ends: {new Date(event.endsAt).toLocaleString()}</div>
                            <div> Location: {event.location}</div>
                            <div> Organizer: {event.organizer.name}</div>
                        </div>
                    </div>
                </div>

                {event.description && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}
            </div>
        </div>
    )
}