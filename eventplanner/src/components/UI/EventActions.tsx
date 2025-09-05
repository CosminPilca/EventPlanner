'use client'

interface EventActionsProps {
    title: string
    description?: string
    location: string
    latitude?: number
    longitude?: number
    startsAt: string
    endsAt: string
}

export default function EventActions({ title, description, location, latitude, longitude, startsAt, endsAt }: EventActionsProps) {
    const handleDirections = () => {
        if (latitude && longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank')
        } else {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank')
        }
    }

    const handleAddToCalendar = () => {
        const eventData = {
            text: title,
            dates: `${new Date(startsAt).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(endsAt).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            details: description || '',
            location
        }
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.text)}&dates=${eventData.dates}&details=${encodeURIComponent(eventData.details)}&location=${encodeURIComponent(eventData.location)}`
        window.open(calendarUrl, '_blank')
    }

    const handleShare = () => {
        navigator.share ?
            navigator.share({ title, text: description || '', url: window.location.href }) :
            navigator.clipboard.writeText(window.location.href).then(() => alert('Event link copied to clipboard!'))
    }

    return (
        <div className="space-y-3">
            <button onClick={handleDirections} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Get Directions
            </button>
            <button onClick={handleAddToCalendar} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Add to Calendar
            </button>
            <button onClick={handleShare} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
                Share Event
            </button>
        </div>
    )
}
