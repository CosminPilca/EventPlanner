export interface GeocodingResult {
  latitude: number
  longitude: number
  formattedAddress?: string
}

export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  try {
    const cleanAddress = address.trim()
    if (!cleanAddress) return null

    const encodedAddress = encodeURIComponent(cleanAddress)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`

    const response = await fetch(url, {
      headers: { 'User-Agent': 'EventPlannerApp/1.0' },
    })

    if (!response.ok) {
      console.error('Geocoding API error:', response.statusText)
      return null
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formattedAddress: result.display_name,
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`

    const response = await fetch(url, {
      headers: { 'User-Agent': 'EventPlannerApp/1.0' },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data?.display_name || null
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}
