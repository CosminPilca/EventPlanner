import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await prisma.$connect()

    const [userCount, eventCount, categoryCount] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.category.count(),
    ])

    const testQuery = await prisma.$queryRaw`SELECT sqlite_version() as version`

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        //@ts-ignore
        sqlite_version: testQuery[0]?.version,
        tables: {
          users: userCount,
          events: eventCount,
          categories: categoryCount,
        },
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
