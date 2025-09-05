import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')

    const events = await prisma.event.findMany({
      where: categorySlug
        ? {
            category: { slug: categorySlug },
          }
        : {},
      include: {
        category: true,
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { startsAt: 'asc' },
    })

    return NextResponse.json(events)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch events'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      startsAt,
      endsAt,
      location,
      categoryId,
      organizerId,
      imageUrl,
    } = body

    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
    })

    if (!organizer || organizer.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'User is not authorized' },
        { status: 403 }
      )
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-')

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        location,
        categoryId,
        organizerId,
        imageUrl,
      },
      include: {
        category: true,
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create events'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
