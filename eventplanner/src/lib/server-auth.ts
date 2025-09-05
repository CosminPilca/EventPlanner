import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromToken } from './auth'

interface User {
    id: string
    email: string
    name: string | null
    role: 'USER' | 'ADMIN'
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth-token')?.value

        if (!token) {
            return null
        }

        const user = await getUserFromToken(token)
        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

export async function validateUserIsAdmin(): Promise<User | null> {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        return null
    }

    return user
}

export async function requireAuthServer(): Promise<User> {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/signin')
    }

    return user
}

export async function requireAdminServer(redirectPath?: string): Promise<User> {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/signin')
    }

    if (user.role !== 'ADMIN') {
        const params = new URLSearchParams({
            role: 'ADMIN',
            redirect: redirectPath || '/'
        })
        redirect(`/unauthorized?${params.toString()}`)
    }

    return user
}

export async function signOutUser() {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    return response
}