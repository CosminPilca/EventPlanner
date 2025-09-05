'use client'

import { createUserEvent } from '@/lib/user-actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LocationInputWithSuggestions from '@/components/Map/LocationInputWithSuggestions'

interface Category {
  id: string
  name: string
}

interface UserCreateEventFormProps {
  categories: Category[]
}

export default function UserCreateEventForm({
  categories,
}: UserCreateEventFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successData, setSuccessData] = useState<{
    eventId: string
    eventTitle: string
  } | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    try {
      setError('')
      setIsLoading(true)
      const result = await createUserEvent(formData)

      setSuccessData({
        eventId: result.eventId,
        eventTitle: result.eventTitle,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewEvent = () => {
    if (successData) router.push(`/events/${successData.eventId}`)
  }

  const handleCreateAnother = () => {
    setSuccessData(null)
    setError('')
    const form = document.querySelector('form') as HTMLFormElement
    form?.reset()
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-theme-primary theme-transition">
      {successData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-theme-primary rounded-lg shadow-xl p-8 max-w-md w-full mx-4 border border-theme-primary theme-transition">
            <div className="text-center">
              <div
                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4"
                style={{ backgroundColor: 'var(--color-success)' }}
              >
                <svg
                  className="h-6 w-6"
                  style={{ color: 'var(--color-success-foreground)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-theme-primary mb-2">
                Event Created Successfully!
              </h3>
              <p className="text-sm text-theme-secondary mb-6">
                "{successData.eventTitle}" has been created successfully.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleViewEvent}
                  className="w-full px-4 py-2 rounded-lg theme-transition font-medium"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-foreground)',
                  }}
                >
                  View Event
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="w-full px-4 py-2 rounded-lg theme-transition font-medium"
                  style={{
                    backgroundColor: 'var(--color-success)',
                    color: 'var(--color-success-foreground)',
                  }}
                >
                  Create Another Event
                </button>
                <button
                  onClick={handleBack}
                  className="w-full px-4 py-2 rounded-lg theme-transition font-medium"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-secondary-foreground)',
                  }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-theme-primary rounded-lg shadow-lg border border-theme-primary theme-transition">
        <div className="px-8 py-6 border-b border-theme-primary">
          <h2 className="text-3xl font-bold text-theme-primary text-center">
            Create Event
          </h2>
        </div>

        <form action={handleSubmit} className="px-8 py-6 space-y-6">
          {error && (
            <div
              className="px-4 py-3 rounded-lg border theme-transition"
              style={{
                backgroundColor: 'var(--color-destructive)',
                borderColor: 'var(--color-destructive)',
                color: 'var(--color-destructive-foreground)',
              }}
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-theme-primary mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-3 border rounded-lg theme-transition bg-theme-primary text-theme-primary focus:ring-2 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-semibold text-theme-primary mb-2"
              >
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                readOnly
                className="w-full px-4 py-3 border rounded-lg theme-transition bg-theme-secondary text-theme-muted"
                placeholder="(auto-generated)"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-theme-primary mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-4 py-3 border rounded-lg theme-transition bg-theme-primary text-theme-primary focus:ring-2 focus:border-transparent"
              placeholder="Enter event description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="startsAt"
                className="block text-sm font-semibold text-theme-primary mb-2"
              >
                Starts At
              </label>
              <input
                type="datetime-local"
                id="startsAt"
                name="startsAt"
                required
                className="w-full px-4 py-3 border rounded-lg theme-transition bg-theme-primary text-theme-primary focus:ring-2 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="endsAt"
                className="block text-sm font-semibold text-theme-primary mb-2"
              >
                Ends At
              </label>
              <input
                type="datetime-local"
                id="endsAt"
                name="endsAt"
                required
                className="w-full px-4 py-3 border rounded-lg theme-transition bg-theme-primary text-theme-primary focus:ring-2 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationInputWithSuggestions
              name="location"
              id="location"
              label="Location"
              required
              placeholder="Enter event location (e.g., Cluj-Napoca, Romania)"
            />
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-semibold text-theme-primary mb-2"
              >
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="w-full px-4 py-3 border rounded-lg theme-transition bg-theme-primary text-theme-primary focus:ring-2 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-semibold text-theme-primary mb-2"
            >
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="w-full px-4 py-3 border rounded-lg theme-transition bg-theme-primary text-theme-primary focus:ring-2 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-center space-x-4 pt-6 border-t border-theme-primary">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-3 border rounded-lg font-medium theme-transition text-theme-primary hover:bg-theme-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 font-medium rounded-lg theme-transition disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
              }}
            >
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
