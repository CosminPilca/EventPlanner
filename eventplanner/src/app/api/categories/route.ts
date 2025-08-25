import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { events: true }
                }
            }
        })
        return NextResponse.json(categories)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name } = body

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

        const category = await prisma.category.create({
            data: { name, slug }
        })

        return NextResponse.json(category)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create category'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}