'use client'

import {useTheme} from "next-themes";


export default function AppContent() {
   const {theme} = useTheme()
    console.log(theme)
    return (
        <div className="relative flex min-h-screen flex-col bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-6 text-gray-900 dark:text-white light:text-black">
                    Welcome to the  { '  ' }
                    <span className=" block text-blue-600 dark:text-blue-400">Event Planner</span>
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Discover amazing events in your area and create unforgettable experiences.
                    From tech conferences to networking meetups, we've got you covered.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 py-2 rounded-md font-medium transition-colors">
                        Browse Events
                    </button>

                </div>

                <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                        For Event Organizers
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Want to create and manage events? Sign in to access the admin portal.
                    </p>
                    <a
                        href="/auth/signin"
                        className="inline-block bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        Sign In to Admin Portal
                    </a>
                </div>
            </div>
        </div>
            </div>
    )





}