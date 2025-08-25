import { prisma } from '@/lib/prisma'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions'
import Link from 'next/link'
import CategoryActions from '@/components/admincomps/CategoryActions'

type CategoryWithCount = {
    id: string
    name: string
    slug: string
    createdAt: Date
    _count: {
        events: number
    }
}

async function getCategories(): Promise<CategoryWithCount[]> {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { events: true }
            }
        },
        orderBy: { name: 'asc' }
    })
    return categories
}

export default async function ManageCategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                                Event Planner
                            </Link>
                            <span className="text-sm text-gray-500">Admin</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Manage Categories</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
                            </div>
                            <form action={createCategory} className="px-6 py-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="Enter category name"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600  py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                    style={{color: 'white'}}
                                >
                                    Create Category
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 bg-white rounded-lg shadow-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
                            </div>
                            <div className="px-6 py-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Categories:</span>
                                        <span className="font-semibold text-blue-600">{categories.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Events:</span>
                                        <span className="font-semibold text-green-600">
                                            {categories.reduce((sum, cat) => sum + cat._count.events, 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">All Categories</h2>
                            </div>

                            {categories.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                                    <p className="text-gray-500">Create your first category to get started.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {categories.map((category: CategoryWithCount) => (
                                        <div key={category.id} className="px-6 py-6 hover:bg-gray-50 transition duration-150">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <span className="text-blue-600 font-semibold text-sm">
                                                                    {category.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                                                            <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                                                            <p className="text-xs text-gray-400">
                                                                Created: {new Date(category.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-blue-600">{category._count.events}</div>
                                                        <div className="text-xs text-gray-500">Events</div>
                                                    </div>

                                                    <CategoryActions
                                                        category={category}
                                                        updateCategory={updateCategory}
                                                        deleteCategory={deleteCategory}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/admin"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}