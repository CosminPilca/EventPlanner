'use client'

import { useState, useRef, useEffect } from 'react'

interface LocationSuggestion {
    display_name: string
    lat: string
    lon: string
    place_id: string
}

interface LocationInputProps {
    name: string
    id: string
    required?: boolean
    placeholder?: string
    defaultValue?: string
    className?: string
    label?: string
}

export default function LocationInputWithSuggestions({
                                                         name,
                                                         id,
                                                         required = false,
                                                         placeholder = "Enter location",
                                                         defaultValue = "",
                                                         className = "",
                                                         label
                                                     }: LocationInputProps) {
    const [inputValue, setInputValue] = useState(defaultValue)
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const inputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLUListElement>(null)
    // @ts-ignore
    const debounceRef = useRef<NodeJS.Timeout>()

    const searchLocations = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        setIsLoading(true)

        try {
            const params = new URLSearchParams({
                format: 'json',
                q: query,
                limit: '8',
                addressdetails: '1',
                countrycodes: 'ro',
                'accept-language': 'en'
            })

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                    headers: { 'User-Agent': 'EventPlannerApp/1.0' }
                }
            )

            if (response.ok) {
                const data: LocationSuggestion[] = await response.json()

                if (data.length < 3) {
                    const globalParams = new URLSearchParams({
                        format: 'json',
                        q: query,
                        limit: '5',
                        addressdetails: '1',
                        'accept-language': 'en'
                    })

                    const globalResponse = await fetch(
                        `https://nominatim.openstreetmap.org/search?${globalParams.toString()}`,
                        {
                            headers: { 'User-Agent': 'EventPlannerApp/1.0' }
                        }
                    )

                    if (globalResponse.ok) {
                        const globalData: LocationSuggestion[] = await globalResponse.json()
                        const combinedData = [...data]
                        globalData.forEach(item => {
                            if (!data.find(d => d.place_id === item.place_id)) {
                                combinedData.push(item)
                            }
                        })
                        setSuggestions(combinedData.slice(0, 8))
                    } else {
                        setSuggestions(data)
                    }
                } else {
                    setSuggestions(data)
                }

                setShowSuggestions(true)
                setSelectedIndex(-1)
            }
        } catch (error) {
            console.warn('Location search failed:', error)
            setSuggestions([])
            setShowSuggestions(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            searchLocations(value)
        }, 300)
    }

    const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
        setInputValue(suggestion.display_name)
        setShowSuggestions(false)
        setSuggestions([])
        setSelectedIndex(-1)

        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSuggestionSelect(suggestions[selectedIndex])
                }
                break
            case 'Escape':
                setShowSuggestions(false)
                setSelectedIndex(-1)
                break
        }
    }

    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false)
            setSelectedIndex(-1)
        }, 200)
    }

    const handleFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true)
        }
    }

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [])

    return (
        <div className="relative">
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-theme-primary mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    id={id}
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required={required}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`w-full px-4 py-3 border border-theme-primary rounded-lg focus:ring-2 focus:border-transparent theme-transition bg-theme-primary text-theme-primary pr-10 ${className}`}
                />

                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {!isLoading && inputValue && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto mt-1"
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.place_id}
                            onClick={() => handleSuggestionSelect(suggestion)}
                            className={`px-4 py-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors ${
                                index === selectedIndex
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                        >
                            <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">
                                        {suggestion.display_name.split(',')[0]}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {suggestion.display_name}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}