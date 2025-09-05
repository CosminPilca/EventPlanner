// prisma/seedRomanianEvents.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Create categories if not exist
  const categoriesData = [
    { name: 'Music', slug: 'music' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Art', slug: 'art' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Food', slug: 'food' },
  ]

  const categories = {}
  for (const cat of categoriesData) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    })
    if (existing) {
      categories[cat.name] = existing
    } else {
      categories[cat.name] = await prisma.category.create({ data: cat })
    }
  }

  // Create users if not exist
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { name: 'Regular User', email: 'user@example.com', role: 'USER' },
  })

  // Create events
  const eventsData = [
    {
      title: 'Cluj Jazz Night',
      slug: 'cluj-jazz-night',
      description: 'An evening of live jazz music in Cluj-Napoca.',
      startsAt: new Date('2025-09-10T19:00:00'),
      endsAt: new Date('2025-09-10T23:00:00'),
      location: 'Strada Piezișă 6, Cluj-Napoca',
      category: 'Music',
      organizer: adminUser,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/1/19/Cluj-Napoca_jazz_concert.jpg',
    },
    {
      title: 'Bucharest Marathon',
      slug: 'bucharest-marathon',
      description: 'Join runners from all over Romania in Bucharest.',
      startsAt: new Date('2025-10-05T08:00:00'),
      endsAt: new Date('2025-10-05T14:00:00'),
      location: 'Piața Unirii, București',
      category: 'Sports',
      organizer: regularUser,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bucharest_marathon.jpg',
    },
    {
      title: 'Sibiu Art Expo',
      slug: 'sibiu-art-expo',
      description: 'A contemporary art exhibition in Sibiu.',
      startsAt: new Date('2025-09-20T10:00:00'),
      endsAt: new Date('2025-09-20T18:00:00'),
      location: 'Strada Nicolae Bălcescu 2, Sibiu',
      category: 'Art',
      organizer: adminUser,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/5/52/Sibiu_art_expo.jpg',
    },
    {
      title: 'Tech Conference Cluj',
      slug: 'tech-conference-cluj',
      description: 'A one-day technology and innovation conference.',
      startsAt: new Date('2025-11-15T09:00:00'),
      endsAt: new Date('2025-11-15T17:00:00'),
      location: 'Strada Memorandumului 28, Cluj-Napoca',
      category: 'Technology',
      organizer: regularUser,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/7/7d/Tech_conference_cluj.jpg',
    },
    {
      title: 'Romanian Food Festival',
      slug: 'romanian-food-festival',
      description: 'Taste traditional Romanian dishes and drinks.',
      startsAt: new Date('2025-09-25T12:00:00'),
      endsAt: new Date('2025-09-25T20:00:00'),
      location: 'Piața Mare, Brașov',
      category: 'Food',
      organizer: adminUser,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/2/2f/Romanian_food_festival.jpg',
    },
  ]

  for (const e of eventsData) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        title: e.title,
        slug: e.slug,
        description: e.description,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        location: e.location,
        categoryId: categories[e.category].id,
        organizerId: e.organizer.id,
        imageUrl: e.imageUrl,
      },
    })
  }

  console.log('Romanian events created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
