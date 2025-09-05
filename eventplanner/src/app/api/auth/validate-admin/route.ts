import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/server-auth'

export async function GET(request: NextRequest) {
    try {
        const user = await requireAdminServer()

        return NextResponse.json({
            valid: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        return NextResponse.json(
            { valid: false, error: 'Admin access required' },
            { status: 403 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAdminServer()


        return NextResponse.json({
            valid: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        return NextResponse.json(
            { valid: false, error: 'Admin access required' },
            { status: 403 }
        )
    }
}