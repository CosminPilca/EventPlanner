'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  hasRole: (role: 'USER' | 'ADMIN') => boolean
  canAccessAdminRoutes: () => boolean
  checkPermissions: (requiredRole: 'USER' | 'ADMIN') => boolean
  refreshUser: () => Promise<void>
  validateAdminAccess: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  initialUser?: User | null
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [loading, setLoading] = useState(!initialUser)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        return userData.user
      } else {
        setUser(null)
        return null
      }
    } catch (error) {
      console.error('Auth refresh failed:', error)
      setUser(null)
      return null
    }
  }

  const validateAdminAccess = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate-admin', {
        credentials: 'include',
        cache: 'no-store',
      })
      return response.ok
    } catch (error) {
      console.error('Admin validation failed:', error)
      return false
    }
  }

  useEffect(() => {
    if (!user || loading) return

    const currentPath = window.location.pathname

    if (currentPath.startsWith('/admin')) {
      if (user.role !== 'ADMIN') {
        const params = new URLSearchParams({
          role: 'ADMIN',
          redirect: '/',
        })
        router.push(`/unauthorized?${params.toString()}`)
        return
      }

      validateAdminAccess().then((isValid) => {
        if (!isValid) {
          const params = new URLSearchParams({
            role: 'ADMIN',
            redirect: '/',
          })
          router.push(`/unauthorized?${params.toString()}`)
        }
      })
    }
  }, [user?.role, loading, router])

  useEffect(() => {
    if (initialUser) {
      validateCurrentUser()
    } else {
      checkAuth()
    }
  }, [])

  const validateCurrentUser = async () => {
    if (!initialUser) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      })

      if (!response.ok) {
        setUser(null)
      }
    } catch (error) {
      console.error('User validation failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setUser(data.user)

      if (data.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/events')
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setUser(data.user)
      router.push('/events')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
      setUser(null)
      router.push('/')
    }
  }

  const hasRole = (role: 'USER' | 'ADMIN'): boolean => {
    if (!user) return false

    if (role === 'ADMIN') {
      return user.role === 'ADMIN'
    }

    return user.role === 'USER' || user.role === 'ADMIN'
  }

  const canAccessAdminRoutes = (): boolean => {
    return user?.role === 'ADMIN'
  }

  const checkPermissions = (requiredRole: 'USER' | 'ADMIN'): boolean => {
    return hasRole(requiredRole)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'ADMIN',
        hasRole,
        canAccessAdminRoutes,
        checkPermissions,
        refreshUser,
        validateAdminAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAdminAuth() {
  const auth = useAuth()

  if (!auth.isAdmin) {
    throw new Error('useAdminAuth can only be used in admin contexts')
  }

  return auth
}
