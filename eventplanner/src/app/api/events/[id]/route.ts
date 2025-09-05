import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch event'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
