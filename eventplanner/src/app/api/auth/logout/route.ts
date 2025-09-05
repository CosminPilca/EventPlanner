import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Logout successful'
        })

        response.cookies.delete('auth-token')

        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}