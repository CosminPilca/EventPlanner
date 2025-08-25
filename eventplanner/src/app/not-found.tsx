 import LinkButton from '@/components/UI/LinkButton'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="relative">
                        <div className="text-9xl font-bold text-gray-300 select-none">404</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.529-.901-6.172-2.379C7.788 10.424 9.748 9 12 9s4.212 1.424 6.172 3.621A7.962 7.962 0 0112 15z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Oops! The page you're looking for doesn't exist yet. This feature is currently under development.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-800 font-medium">
                                    🚧 This feature is coming soon!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <LinkButton
                            href="/admin"
                            variant="primary"
                            size="lg"
                            fullWidth
                        >
                            Back to Admin Dashboard
                        </LinkButton>

                        <div className="flex space-x-3">
                            <LinkButton
                                href="/events"
                                variant="secondary"
                                className="flex-1"
                            >
                                Browse Events
                            </LinkButton>
                            <LinkButton
                                href="/"
                                variant="secondary"
                                className="flex-1"
                            >
                                Go Home
                            </LinkButton>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            If you believe this is an error, please contact the tech support.
                        </p>
                    </div>
                </div>

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-indigo-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300 rounded-full opacity-50 animate-pulse delay-500"></div>
                </div>
            </div>
        </div>
    )
}