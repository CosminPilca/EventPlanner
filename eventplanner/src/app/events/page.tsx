import { prisma } from '@/lib/prisma'
import LinkButton from '@/components/UI/LinkButton'
import Link from 'next/link'
import { classNames } from '@/utils/ClassNames'

export const dynamic = 'force-dynamic'

type Event = {
  id: string
  title: string
  description: string | null
  startsAt: Date
  location: string
  imageUrl: string | null
  category: {
    name: string
    slug: string
  }
  organizer: {
    name: string | null
  }
}

type Category = {
  id: string
  name: string
  slug: string
}

async function getEvents(categorySlug?: string): Promise<Event[]> {
  const events = await prisma.event.findMany({
    where: categorySlug
      ? {
          category: {
            slug: categorySlug,
          },
        }
      : undefined,
    include: {
      category: true,
      organizer: {
        select: { name: true },
      },
    },
    orderBy: { startsAt: 'asc' },
  })
  return events
}

async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany()
  return categories
}

function CategoryFilterButton({
  href,
  children,
  isActive = false,
}: {
  href: string
  children: React.ReactNode
  isActive?: boolean
}) {
  return (
    <Link
      href={href}
      className={classNames(
        'px-4 py-2 font-medium rounded-lg transition-colors',
        isActive
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-200 text-black hover:bg-gray-300'
      )}
    >
      {children}
    </Link>
  )
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const selectedCategory = searchParams.category

  const [events, categories] = await Promise.all([
    getEvents(selectedCategory),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8" style={{ color: 'white' }}>
      <h1 className="text-3xl font-bold mb-8 ">Browse Events</h1>

      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          <CategoryFilterButton href="/events" isActive={!selectedCategory}>
            All Categories
          </CategoryFilterButton>
          {categories.map((category: Category) => (
            <CategoryFilterButton
              key={category.id}
              href={`/events?category=${category.slug}`}
              isActive={selectedCategory === category.slug}
            >
              {category.name}
            </CategoryFilterButton>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: Event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="text-sm text-blue-600 mb-2">
                {event.category.name}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                {event.title}
              </h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="text-sm text-gray-500 mb-2">
                {new Date(event.startsAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 mb-4">{event.location}</div>
              <LinkButton href={`/events/${event.id}`} variant="primary">
                View Details
              </LinkButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
