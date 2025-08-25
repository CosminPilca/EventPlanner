'use client'
import { useState } from 'react'

export default function DatabaseStatus() {
    const [testing, setTesting] = useState(false)
    const [result, setResult] = useState<any>(null)

    const testConnection = async () => {
        setTesting(true)
        setResult(null)

        try {
            const response = await fetch('/api/test-db')
            const data = await response.json()
            setResult(data)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Test failed'
            setResult({
                success: false,
                error: errorMessage
            })
        } finally {
            setTesting(false)
        }
    }

    return (
        <div className="space-y-2">
            <button
                onClick={testConnection}
                disabled={testing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                style={{color: 'white'}}
            >
                {testing ? 'Testing' : 'Test Connection'}
            </button>

            {result && (
                <div className={`p-3 rounded text-sm ${
                    result.success
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {result.success ? (
                        <div>
                            <p className="font-semibold"> Connection successful!</p>
                            <p>SQLite: {result.data?.sqlite_version}</p>
                            <p>Tables: {result.data?.tables?.users} users, {result.data?.tables?.events} events, {result.data?.tables?.categories} categories</p>
                            <p className="text-xs mt-1">Tested: {new Date(result.timestamp).toLocaleString()}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-semibold"> Connection failed</p>
                            <p>{result.error}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}