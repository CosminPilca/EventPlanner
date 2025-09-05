import { getUserEvents } from '@/lib/user-actions'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, MapPin, Edit, Trash2, Plus } from 'lucide-react'
import DeleteEventButton from '@/components/forms/DeleteEventUserButton'

async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })
}

export default async function MyEventsPage() {
    try {
        const [events, categories] = await Promise.all([
            getUserEvents(),
            getCategories()
        ])

        return (
            <div className="container mx-auto px-4 py-8" style={{color: 'white'}}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Events</h1>
                        <p className="text-gray-600 mt-2">
                            Manage your events and view their locations
                        </p>
                    </div>
                    <Link
                        href="/user-events/create"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create Event
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <Calendar size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No Events Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Create your first event and share it with the world!
                        </p>
                        <Link
                            href="/user-events/create"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create Your First Event
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {event.imageUrl && (
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                            {event.category.name}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {event.latitude && event.longitude && (
                                                <div className="w-2 h-2 bg-green-500 rounded-full" title="Location mapped" />
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3 text-black">
                                        {event.title}
                                    </h3>

                                    {event.description && (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {event.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>
                                                {new Date(event.startsAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/events/${event.id}`}
                                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href={`/user-events/edit/${event.id}`}
                                            className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
                                            title="Edit Event"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    } catch (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Please log in to view your events.
                    </p>
                    <Link
                        href="/auth/signin"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        )
    }
}