'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SignInForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/events'

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            await login(formData.email, formData.password)
            router.push(redirectTo)
        } catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : 'Sign in failed. Please try again.'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
                <div
                    className="p-3 rounded-md text-sm border"
                    style={{
                        backgroundColor: 'var(--color-destructive)',
                        color: 'var(--color-destructive-foreground)',
                        borderColor: 'var(--color-destructive)'
                    }}
                >
                    {errors.submit}
                </div>
            )}

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-theme-primary mb-1"
                >
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`
                        appearance-none relative block w-full px-3 py-2 rounded-md
                        placeholder-theme-muted text-theme-primary
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10
                        theme-transition text-sm
                        ${errors.email
                        ? 'border-2'
                        : 'border border-theme-primary focus:border-transparent'
                    }
                    `}
                    style={{
                        backgroundColor: 'var(--color-bg-primary)',
                        ...(errors.email && {
                            borderColor: 'var(--color-destructive)'
                        })
                    }}
                    placeholder="Enter your email"
                />
                {errors.email && (
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-destructive)' }}>
                        {errors.email}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-theme-primary mb-1"
                >
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`
                            appearance-none relative block w-full px-3 py-2 pr-10 rounded-md
                            placeholder-theme-muted text-theme-primary
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10
                            theme-transition text-sm
                            ${errors.password
                            ? 'border-2'
                            : 'border border-theme-primary focus:border-transparent'
                        }
                        `}
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            ...(errors.password && {
                                borderColor: 'var(--color-destructive)'
                            })
                        }}
                        placeholder="Enter your password"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-muted hover:text-theme-secondary theme-transition"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-destructive)' }}>
                        {errors.password}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <Link
                    href="/auth/forgot-password"
                    className="text-sm hover:underline theme-transition"
                    style={{ color: 'var(--color-primary)' }}
                >
                    Forgot your password?
                </Link>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-primary-foreground)'
                    }}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </div>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </div>
        </form>
    )
}