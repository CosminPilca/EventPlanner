import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-super-secret-key'

interface TokenPayload {
    userId: string
    email: string
    role: 'USER' | 'ADMIN'
    iat?: number
    exp?: number
}

function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload
    } catch (error) {
        return null
    }
}

function getTokenFromRequest(request: NextRequest): string | null {
    const tokenFromCookie = request.cookies.get('auth-token')?.value
    if (tokenFromCookie) {
        return tokenFromCookie
    }

    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }

    return null
}

function createUnauthorizedRedirect(request: NextRequest, requiredRole: string = 'ADMIN'): NextResponse {
    const url = new URL('/unauthorized', request.url)
    url.searchParams.set('role', requiredRole)
    url.searchParams.set('redirect', request.nextUrl.pathname)

    const response = NextResponse.redirect(url)

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/images/') ||
        pathname.startsWith('/icons/') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    if (
        pathname.startsWith('/api/auth/login') ||
        pathname.startsWith('/api/auth/register') ||
        pathname.startsWith('/api/auth/logout')
    ) {
        return NextResponse.next()
    }

    if (pathname.startsWith('/auth/')) {
        return NextResponse.next()
    }

    if (pathname === '/unauthorized') {
        return NextResponse.next()
    }

    const token = getTokenFromRequest(request)

    if (!token) {
        const url = new URL('/auth/signin', request.url)
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    const payload = verifyToken(token)
    if (!payload) {
        const url = new URL('/auth/signin', request.url)
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/admin')) {
        if (payload.role !== 'ADMIN') {
            return createUnauthorizedRedirect(request, 'ADMIN')
        }

        const response = NextResponse.next()
        response.headers.set('X-Frame-Options', 'DENY')
        response.headers.set('X-Content-Type-Options', 'nosniff')
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
        return response
    }

    if (pathname.startsWith('/api/admin')) {
        if (payload.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }
        return NextResponse.next()
    }

    if (pathname.startsWith('/api/')) {
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
}