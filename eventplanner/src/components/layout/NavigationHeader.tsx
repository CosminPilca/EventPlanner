'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, User, LogOut, Settings, Plus } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from "@/components/UI/ThemeToggle"
import { classNames } from '@/utils/ClassNames'

export default function NavigationHeader() {
    const { user, logout, isAdmin } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)

    const handleLogout = async () => {
        await logout()
        setShowUserMenu(false)
    }

    return (
        <header className={classNames(
            "sticky top-0 z-50 w-full border-b theme-transition",
            "bg-theme-primary/95 backdrop-blur supports-[backdrop-filter]:bg-theme-primary/80"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <Calendar className="h-8 w-8 text-theme-accent" />
                        <span className="text-xl font-bold text-theme-text">EventPlanner</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/events"
                            className="text-theme-text hover:text-theme-accent px-3 py-2 rounded-lg transition-colors"
                        >
                            Browse Events
                        </Link>

                        {user && (
                            <>
                                <Link
                                    href="/user-events"
                                    className="bg-theme-accent text-theme-onAccent px-4 py-2 rounded-lg hover:bg-theme-accentHover transition-colors flex items-center gap-2"
                                >
                                    <Calendar size={16} />
                                    My Events
                                </Link>

                                <Link
                                    href="/user-events/create"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Create Event
                                </Link>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                    >
                                        <Settings size={16} />
                                        Admin
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>

                    {/* User Menu & Theme Toggle */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 text-theme-text hover:text-theme-accent focus:outline-none"
                                >
                                    <div className="w-8 h-8 bg-theme-accent/20 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-theme-accent" />
                                    </div>
                                    <span className="hidden sm:block">{user.name || user.email}</span>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-theme-primary rounded-lg shadow-lg border py-2 theme-transition">
                                        <div className="px-4 py-2 border-b border-theme-border">
                                            <p className="text-sm font-medium text-theme-text">
                                                {user.name || 'User'}
                                            </p>
                                            <p className="text-sm text-theme-textSecondary">{user.email}</p>
                                        </div>

                                        <Link
                                            href="/user-events"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-theme-text hover:bg-theme-accent/10"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Calendar size={14} />
                                            My Events
                                        </Link>

                                        <Link
                                            href="/user-events/create"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-theme-text hover:bg-theme-accent/10"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Plus size={14} />
                                            Create Event
                                        </Link>

                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-theme-text hover:bg-theme-accent/10"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <Settings size={14} />
                                                Admin Panel
                                            </Link>
                                        )}

                                        <hr className="my-2 border-theme-border" />

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={14} />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/auth/signin"
                                    className="text-theme-text hover:text-theme-accent px-3 py-2 rounded-lg transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-theme-accent text-theme-onAccent px-4 py-2 rounded-lg hover:bg-theme-accentHover transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <div className="md:hidden">
                            <button className="text-theme-text hover:text-theme-accent">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
