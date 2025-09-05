'use client'
import { useEffect, useState } from 'react'

interface EventLocationMapProps {
    eventTitle: string
    location: string
    latitude?: number | null
    longitude?: number | null
}

export default function EventLocationMap({ eventTitle, location, latitude, longitude }: EventLocationMapProps) {
    const [center, setCenter] = useState<[number, number] | null>(null)
    const [formattedLocation, setFormattedLocation] = useState(location)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [mapComponents, setMapComponents] = useState<any>(null)

    useEffect(() => {
        const loadMap = async () => {
            try {
                const [leafletModule, reactLeafletModule] = await Promise.all([
                    import('leaflet'),
                    import('react-leaflet'),
                    //@ts-ignore
                    import('leaflet/dist/leaflet.css')
                ])

                const L = leafletModule.default

                delete (L.Icon.Default.prototype as any)._getIconUrl
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                })

                setMapComponents({
                    MapContainer: reactLeafletModule.MapContainer,
                    TileLayer: reactLeafletModule.TileLayer,
                    Marker: reactLeafletModule.Marker,
                    Popup: reactLeafletModule.Popup,
                    L
                })
            } catch (err) {
                console.error('Failed to load map:', err)
                setError('Failed to load map components')
                setIsLoading(false)
            }
        }

        loadMap()
    }, [])

    useEffect(() => {
        if (!mapComponents) return

        const setupLocation = async () => {
            setIsLoading(true)
            setError(null)

            if (latitude && longitude) {
                setCenter([latitude, longitude])
                setIsLoading(false)
                return
            }

            if (location) {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&addressdetails=1`,
                        { headers: { 'User-Agent': 'EventPlannerApp/1.0' } }
                    )

                    if (!response.ok) throw new Error('Geocoding failed')

                    const data = await response.json()
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat)
                        const lon = parseFloat(data[0].lon)
                        setCenter([lat, lon])
                        setFormattedLocation(data[0].display_name || location)
                    } else {
                        setError('Location not found')
                    }
                } catch (err) {
                    console.warn('Geocoding failed:', err)
                    setError('Unable to load map for this location')
                }
            } else {
                setError('No location provided')
            }

            setIsLoading(false)
        }

        setupLocation()
    }, [location, latitude, longitude, mapComponents])

    if (isLoading) {
        return (
            <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                </div>
            </div>
        )
    }

    if (error || !center || !mapComponents) {
        return (
            <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500">{error || 'Map unavailable'}</p>
                </div>
            </div>
        )
    }

    const { MapContainer, TileLayer, Marker, Popup } = mapComponents

    return (
        <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={center}>
                    <Popup>
                        <div className="text-center">
                            <strong className="block mb-1">{eventTitle}</strong>
                            <span className="text-sm text-gray-600">{formattedLocation}</span>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}