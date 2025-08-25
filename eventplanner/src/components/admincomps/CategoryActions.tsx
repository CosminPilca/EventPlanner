'use client'
import { useState } from 'react'

interface CategoryActionsProps {
    category: {
        id: string
        name: string
        slug: string
        _count: {
            events: number
        }
    }
    updateCategory: (formData: FormData) => Promise<void>
    deleteCategory: (formData: FormData) => Promise<void>
}

export default function CategoryActions({ category, updateCategory, deleteCategory }: CategoryActionsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [editName, setEditName] = useState(category.name)

    const handleEditClick = () => {
        setEditName(category.name)
        setIsEditing(true)
        setError(null)
    }

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('id', category.id)
            formData.append('name', editName.trim())
            await updateCategory(formData)
            setIsEditing(false)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update category')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('id', category.id)
            await deleteCategory(formData)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete category')
            setShowDeleteConfirm(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditName(category.name)
        setIsEditing(false)
        setError(null)
    }

    if (isEditing) {
        return (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Edit Category</h4>
                <form onSubmit={handleEdit} className="space-y-3">
                    <div>
                        <label htmlFor={`edit-name-${category.id}`} className="block text-sm font-medium text-black mb-1">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id={`edit-name-${category.id}`}
                            name="name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            required
                            disabled={isLoading}
                            autoFocus
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                            style={{color: 'black'}}

                        />
                    </div>

                    {error && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !editName.trim()}
                            className="px-3 py-1.5 text-sm font-medium  bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            style={{color: 'white'}}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    if (showDeleteConfirm) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">Delete Category</h4>
                <p className="text-sm text-red-800 mb-3">
                    Are you sure you want to delete "{category.name}"?
                </p>

                {category._count.events > 0 && (
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md mb-3">
                        <p className="text-sm text-yellow-800">
                            ⚠️ This category has {category._count.events} event(s) and cannot be deleted.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="p-2 bg-red-100 border border-red-300 rounded-md mb-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setShowDeleteConfirm(false)
                            setError(null)
                        }}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        No, Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading || category._count.events > 0}
                        className="px-3 py-1.5 text-sm font-medium  bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                        style={{color: 'white'}}
                    >
                        {isLoading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex space-x-2">
            <button
                onClick={handleEditClick}
                className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
                Edit
            </button>
            <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 text-sm font-medium bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                style={{color: 'white'}}
            >

                Delete
            </button>
        </div>
    )
}