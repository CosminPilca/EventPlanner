import { prisma } from '@/lib/prisma'
export const getAdminStats = async () => {
  const [eventCount, userCount, categoryCount] = await Promise.all([
    prisma.event.count(),
    prisma.user.count(),
    prisma.category.count(),
  ])

  return { eventCount, userCount, categoryCount }
}

export const testDatabaseConnection = async () => {
  try {
    await prisma.$connect()
    const version = await prisma.$queryRaw`SELECT sqlite_version() as version`
    await prisma.$disconnect()

    return {
      connected: true,
      version: version[0]?.version,
      error: null,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Connection failed'
    return {
      connected: false,
      version: null,
      error: errorMessage,
    }
  }
}
