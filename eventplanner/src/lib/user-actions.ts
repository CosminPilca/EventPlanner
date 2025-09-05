'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { geocodeAddress } from './geocoding'
import { getUserFromToken } from './auth'
import { cookies } from 'next/headers'

async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
        throw new Error('Not authenticated')
    }

    const user = await getUserFromToken(token)
    if (!user) {
        throw new Error('Invalid session')
    }

    return user
}

export async function createUserEvent(formData: FormData) {
    const user = await getCurrentUser()

    const title = formData.get('title')?.toString() || ''
    const description = formData.get('description')?.toString() || ''
    const startsAt = formData.get('startsAt')?.toString() || ''
    const endsAt = formData.get('endsAt')?.toString() || ''
    let location = formData.get('location')?.toString() || ''
    const categoryId = formData.get('categoryId')?.toString() || ''
    const imageUrl = formData.get('imageUrl')?.toString() || ''

    if (!title || !startsAt || !endsAt || !location || !categoryId) {
        throw new Error('All required fields must be filled')
    }

    try {
        // Geocode the location
        let latitude: number | null = null
        let longitude: number | null = null

        try {
            const geocoded = await geocodeAddress(location)
            if (geocoded) {
                latitude = geocoded.latitude
                longitude = geocoded.longitude
                location = geocoded.formattedAddress || location
            }
        } catch (err) {
            console.warn('Geocoding failed:', err)
        }

        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')

        const event = await prisma.event.create({
            data: {
                title,
                slug,
                description: description || null,
                startsAt: new Date(startsAt),
                endsAt: new Date(endsAt),
                location,
                latitude,
                longitude,
                categoryId,
                organizerId: user.id,
                imageUrl: imageUrl || null
            }
        })

        revalidatePath('/events')
        revalidatePath('/my-events')

        return {
            success: true,
            eventId: event.id,
            eventTitle: event.title
        }
    } catch (err) {
        console.error('Error creating event:', err)
        throw new Error(err instanceof Error ? err.message : 'Failed to create event')
    }
}

export async function editUserEvent(formData: FormData) {
    const user = await getCurrentUser()

    const eventId = formData.get('eventId')?.toString() || ''
    const title = formData.get('title')?.toString() || ''
    const description = formData.get('description')?.toString() || ''
    const startsAt = formData.get('startsAt')?.toString() || ''
    const endsAt = formData.get('endsAt')?.toString() || ''
    let location = formData.get('location')?.toString() || ''
    const categoryId = formData.get('categoryId')?.toString() || ''
    const imageUrl = formData.get('imageUrl')?.toString() || ''

    if (!eventId || !title || !startsAt || !endsAt || !location || !categoryId) {
        throw new Error('All required fields must be filled')
    }

    try {
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true, location: true, latitude: true, longitude: true }
        })

        if (!existingEvent) throw new Error('Event not found')
        if (existingEvent.organizerId !== user.id && user.role !== 'ADMIN') {
            throw new Error('You can only edit your own events')
        }

        let latitude: number | null = existingEvent.latitude || null
        let longitude: number | null = existingEvent.longitude || null

        if (existingEvent.location !== location) {
            try {
                const geocoded = await geocodeAddress(location)
                if (geocoded) {
                    latitude = geocoded.latitude
                    longitude = geocoded.longitude
                    location = geocoded.formattedAddress || location
                }
            } catch (err) {
                console.warn('Geocoding failed:', err)
            }
        }

        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')

        const event = await prisma.event.update({
            where: { id: eventId },
            data: {
                title,
                slug,
                description: description || null,
                startsAt: new Date(startsAt),
                endsAt: new Date(endsAt),
                location,
                latitude,
                longitude,
                categoryId,
                imageUrl: imageUrl || null
            }
        })

        revalidatePath('/events')
        revalidatePath('/my-events')
        revalidatePath(`/events/${eventId}`)

        return {
            success: true,
            eventId: event.id,
            eventTitle: event.title
        }
    } catch (err) {
        console.error('Error updating event:', err)
        throw new Error(err instanceof Error ? err.message : 'Failed to update event')
    }
}

export async function deleteUserEvent(eventId: string) {
    const user = await getCurrentUser()

    try {
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true, title: true }
        })

        if (!existingEvent) throw new Error('Event not found')
        if (existingEvent.organizerId !== user.id && user.role !== 'ADMIN') {
            throw new Error('You can only delete your own events')
        }

        await prisma.event.delete({ where: { id: eventId } })

        revalidatePath('/events')
        revalidatePath('/my-events')

        return {
            success: true,
            eventId,
            eventTitle: existingEvent.title
        }
    } catch (err) {
        console.error('Error deleting event:', err)
        throw new Error(err instanceof Error ? err.message : 'Failed to delete event')
    }
}

export async function getUserEvents() {
    const user = await getCurrentUser()  // ensure async

    try {
        const events = await prisma.event.findMany({
            where: { organizerId: user.id },
            include: {
                category: true,
                organizer: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { startsAt: 'asc' }
        })

        return events
    } catch (err) {
        console.error('Error fetching user events:', err)
        throw new Error('Failed to fetch your events')
    }
}
