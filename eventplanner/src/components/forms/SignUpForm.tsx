'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await register(formData.email, formData.password, formData.name.trim())
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Registration failed. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div
          className="p-3 rounded-md text-sm border"
          style={{
            backgroundColor: 'var(--color-destructive)',
            color: 'var(--color-destructive-foreground)',
            borderColor: 'var(--color-destructive)',
          }}
        >
          {errors.submit}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-theme-primary mb-1"
        >
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
          className={`
                        appearance-none relative block w-full px-3 py-2 rounded-md
                        placeholder-theme-muted text-theme-primary
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10
                        theme-transition text-sm
                        ${
                          errors.name
                            ? 'border-2'
                            : 'border border-theme-primary focus:border-transparent'
                        }
                    `}
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            ...(errors.name && {
              borderColor: 'var(--color-destructive)',
            }),
          }}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--color-destructive)' }}
          >
            {errors.name}
          </p>
        )}
      </div>

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
                        ${
                          errors.email
                            ? 'border-2'
                            : 'border border-theme-primary focus:border-transparent'
                        }
                    `}
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            ...(errors.email && {
              borderColor: 'var(--color-destructive)',
            }),
          }}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--color-destructive)' }}
          >
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
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className={`
                            appearance-none relative block w-full px-3 py-2 pr-10 rounded-md
                            placeholder-theme-muted text-theme-primary
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10
                            theme-transition text-sm
                            ${
                              errors.password
                                ? 'border-2'
                                : 'border border-theme-primary focus:border-transparent'
                            }
                        `}
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              ...(errors.password && {
                borderColor: 'var(--color-destructive)',
              }),
            }}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-muted hover:text-theme-secondary theme-transition"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-1 bg-theme-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor:
                      strengthColors[passwordStrength - 1] || '#ef4444',
                  }}
                />
              </div>
              <span className="text-xs text-theme-muted">
                {strengthLabels[passwordStrength - 1] || 'Very Weak'}
              </span>
            </div>
          </div>
        )}

        {errors.password && (
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--color-destructive)' }}
          >
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-theme-primary mb-1"
        >
          Confirm password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`
                            appearance-none relative block w-full px-3 py-2 pr-10 rounded-md
                            placeholder-theme-muted text-theme-primary
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10
                            theme-transition text-sm
                            ${
                              errors.confirmPassword
                                ? 'border-2'
                                : 'border border-theme-primary focus:border-transparent'
                            }
                        `}
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              ...(errors.confirmPassword && {
                borderColor: 'var(--color-destructive)',
              }),
            }}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-muted hover:text-theme-secondary theme-transition"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--color-destructive)' }}
          >
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <div className="text-xs text-theme-muted">
        <p>Password must contain:</p>
        <ul className="mt-1 space-y-1 ml-4">
          <li
            className={`flex items-center ${formData.password.length >= 6 ? 'text-green-600' : ''}`}
          >
            <span className="mr-2">
              {formData.password.length >= 6 ? '✓' : '○'}
            </span>
            At least 6 characters
          </li>
          <li
            className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}
          >
            <span className="mr-2">
              {/[a-z]/.test(formData.password) ? '✓' : '○'}
            </span>
            One lowercase letter
          </li>
          <li
            className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}
          >
            <span className="mr-2">
              {/[A-Z]/.test(formData.password) ? '✓' : '○'}
            </span>
            One uppercase letter
          </li>
          <li
            className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}
          >
            <span className="mr-2">
              {/\d/.test(formData.password) ? '✓' : '○'}
            </span>
            One number
          </li>
        </ul>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
          }}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </div>
          ) : (
            'Create account'
          )}
        </button>
      </div>

      <div className="text-xs text-theme-muted text-center">
        By creating an account, you agree to our{' '}
        <a
          href="/terms"
          className="hover:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="hover:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          Privacy Policy
        </a>
      </div>
    </form>
  )
}
