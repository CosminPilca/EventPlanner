import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.event.findUnique({
            where: {id: params.id},
            include: {
                category: true,
                organizer: {
                    select: {id: true, name: true, email: true},
                }
            }
        })

        if (!event) {
            return NextResponse.json({ error: 'Event now found' }, {status: 404})
        }

        return NextResponse.json(event)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch event'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}