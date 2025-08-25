'use server'
import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
    const title = formData.get('title')?.toString() || ''
    const description = formData.get('description')?.toString() || ''
    const startsAt = formData.get('startsAt')?.toString() || ''
    const endsAt = formData.get('endsAt')?.toString() || ''
    const location = formData.get('location')?.toString() || ''
    const categoryId = formData.get('categoryId')?.toString() || ''
    const organizerId = formData.get('organizerId')?.toString() || ''
    const imageUrl = formData.get('imageUrl')?.toString() || ''

    if (!title || !startsAt || !endsAt || !location || !categoryId || !organizerId) {
        throw new Error('All required fields must be filled')
    }

    try {
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
                categoryId,
                organizerId,
                imageUrl: imageUrl || null
            }
        })

        revalidatePath('/events')
        revalidatePath('/admin/events')

        return {
            success: true,
            eventId: event.id,
            eventTitle: event.title
        }
    } catch (error) {
        console.error('Error creating event:', error)

        if (error && typeof error === 'object' && 'code' in error) {
            switch (error.code) {
                case 'P2002':
                    throw new Error('An event with this title already exists')
                case 'P2003':
                    throw new Error('Invalid category or organizer selected')
                case 'P2025':
                    throw new Error('Category or organizer not found')
                default:
                    throw new Error(`Database error: ${error.code}`)
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Failed to create event'
        throw new Error(errorMessage)
    }
}

export async function createCategory(formData: FormData) {
    const name = formData.get('name')?.toString() || ''

    if (!name) {
        throw new Error('Category name is required')
    }

    try {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')

        await prisma.category.create({
            data: { name, slug }
        })

        revalidatePath('/admin/categories')
    } catch (error) {
        console.error('Error creating category:', error)

        if (error && typeof error === 'object' && 'code' in error) {
            switch (error.code) {
                case 'P2002':
                    throw new Error('A category with this name already exists')
                default:
                    throw new Error(`Database error: ${error.code}`)
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Failed to create category'
        throw new Error(errorMessage)
    }
}

export async function editEvent(formData: FormData) {
    const eventId = formData.get('eventId')?.toString() || ''
    const title = formData.get('title')?.toString() || ''
    const description = formData.get('description')?.toString() || ''
    const startsAt = formData.get('startsAt')?.toString() || ''
    const endsAt = formData.get('endsAt')?.toString() || ''
    const location = formData.get('location')?.toString() || ''
    const categoryId = formData.get('categoryId')?.toString() || ''
    const organizerId = formData.get('organizerId')?.toString() || ''
    const imageUrl = formData.get('imageUrl')?.toString() || ''

    if (!eventId || !title || !startsAt || !endsAt || !location || !categoryId || !organizerId) {
        throw new Error('All required fields must be filled')
    }

    try {
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')

        const event = await prisma.event.update({
            where: {id: eventId},
            data: {
                title,
                slug,
                description: description || null,
                startsAt: new Date(startsAt),
                endsAt: new Date(endsAt),
                location,
                categoryId,
                organizerId,
                imageUrl: imageUrl || null
            }
        })

        revalidatePath('/events')
        revalidatePath('/admin/events')
        revalidatePath('/admin/edit')

        return {
            success: true,
            eventId: event.id,
            eventTitle: event.title
        }
    } catch (error) {
        console.error('Error updating event:', error)

        if (error && typeof error === 'object' && 'code' in error) {
            switch (error.code) {
                case 'P2002':
                    throw new Error('An event with this title already exists')
                case 'P2003':
                    throw new Error('Invalid category or organizer selected')
                case 'P2025':
                    throw new Error('Event not found')
                default:
                    throw new Error(`Database error: ${error.code}`)
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Failed to update event'
        throw new Error(errorMessage)
    }
}

export async function updateCategory(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string

    if (!id || !name) {
        throw new Error('Category ID and name are required')
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

    try {
        await prisma.category.update({
            where: {id},
            data: {
                name,
                slug
            }
        })

        revalidatePath('/admin/categories')
    } catch (error) {
        throw new Error('Failed to update category')
    }
}

export async function deleteCategory(formData: FormData) {
    const id = formData.get('id') as string

    if (!id) {
        throw new Error('Category ID is required')
    }

    try {
        const categoryWithEvents = await prisma.category.findUnique({
            where: {id},
            include: {
                _count: {
                    select: {events: true}
                }
            }
        })

        if (categoryWithEvents && categoryWithEvents._count.events > 0) {
            throw new Error(`Cannot delete category "${categoryWithEvents.name}" because it has ${categoryWithEvents._count.events} events associated with it.`)
        }

        await prisma.category.delete({
            where: {id}
        })

        revalidatePath('/admin/categories')
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }
        throw new Error('Failed to delete category')
    }
}
export async function deleteEvent(formData: FormData) {
    try {
        const eventId = formData.get('eventId') as string

        if (!eventId) {
            throw new Error('Event ID is required')
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { title: true }
        })

        if (!event) {
            throw new Error('Event not found')
        }

        await prisma.event.delete({
            where: { id: eventId }
        })

        revalidatePath('/admin/delete')
        revalidatePath('/admin')
        revalidatePath('/events')

        return {
            eventId,
            eventTitle: event.title
        }
    } catch (error) {
        console.error('Error deleting event:', error)

        if (error && typeof error === 'object' && 'code' in error) {
            switch (error.code) {
                case 'P2025':
                    throw new Error('Event not found')
                default:
                    throw new Error(`Database error: ${error.code}`)
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Failed to delete event'
        throw new Error(errorMessage)
    }
}