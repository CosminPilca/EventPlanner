import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EventLocationMap from '@/components/Map/EventLocationMap'
import EventActions from '@/components/UI/EventActions'

interface PageProps {
  params: { id: string }
}

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      category: true,
      organizer: {
        select: { name: true, email: true },
      },
    },
  })

  if (!event) notFound()
  return event
}

export default async function EventDetailPage({ params }: PageProps) {
  const event = await getEvent(params.id)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date))
  }

  const getEventStatus = () => {
    const now = new Date()
    const startDate = new Date(event.startsAt)
    const endDate = new Date(event.endsAt)

    if (now < startDate) return { status: 'upcoming', color: 'blue' }
    if (now > endDate) return { status: 'ended', color: 'gray' }
    return { status: 'ongoing', color: 'green' }
  }

  const eventStatus = getEventStatus()

  // @ts-ignore
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          {event.imageUrl && (
            <div className="relative mb-8">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {event.category.name}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize
                                ${eventStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                                ${eventStatus.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                                ${eventStatus.color === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
                            `}
              >
                {eventStatus.status}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                </div>
                <span>
                  Organized by{' '}
                  <span className="font-semibold text-gray-900">
                    {event.organizer.name || 'Anonymous'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {event.description && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    About This Event
                  </h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Location
                </h3>
                <div className="mb-4">
                  <div className="flex items-center text-gray-700 mb-2">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>

                <EventLocationMap
                  eventTitle={event.title}
                  location={event.location}
                  latitude={event.latitude}
                  longitude={event.longitude}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Event Schedule
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        Starts
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formatDate(event.startsAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        Ends
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formatDate(event.endsAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <EventActions
                  title={event.title}
                  //@ts-ignore
                  description={event.description}
                  location={event.location}
                  //@ts-ignore
                  latitude={event.latitude}
                  //@ts-ignore
                  longitude={event.longitude}
                  //@ts-ignore
                  startsAt={event.startsAt}
                  //@ts-ignore
                  endsAt={event.endsAt}
                />
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Organizer
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {(event.organizer.name || event.organizer.email)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {event.organizer.name || 'Anonymous'}
                    </div>
                    <a
                      href={`mailto:${event.organizer.email}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {event.organizer.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
