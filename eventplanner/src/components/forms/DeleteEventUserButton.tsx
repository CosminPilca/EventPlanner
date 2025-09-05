'use client'
import { useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { deleteUserEvent } from '@/lib/user-actions'
import { useRouter } from 'next/navigation'

interface DeleteEventButtonProps {
    eventId: string
    eventTitle: string
}

export default function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        setError('')

        try {
            await deleteUserEvent(eventId)
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete event')
            setIsDeleting(false)
        }
    }

    if (showConfirm) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Delete Event</h3>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={isDeleting}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete "{eventTitle}"? This action cannot be undone.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Delete Event
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors"
            title="Delete Event"
        >
            <Trash2 size={16} />
        </button>
    )
}