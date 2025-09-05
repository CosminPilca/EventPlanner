'use client'

export default function AppContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-theme-primary theme-transition">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-6 text-theme-primary theme-transition">
            Welcome to the {'  '}
            <span
              className="block theme-transition"
              style={{ color: 'var(--color-primary)' }}
            >
              Event Planner
            </span>
          </h1>

          <p className="text-lg text-theme-secondary mb-8 theme-transition">
            Discover amazing events in your area and create unforgettable
            experiences. From tech conferences to networking meetups, we've got
            you covered.
          </p>

          {/*<div className="flex flex-col sm:flex-row gap-4 justify-center">*/}
          {/*    <button*/}
          {/*        className="h-10 px-4 py-2 rounded-md font-medium theme-transition hover-theme-bg border border-theme-primary"*/}
          {/*        style={{*/}
          {/*            backgroundColor: 'var(--color-primary)',*/}
          {/*            color: 'var(--color-primary-foreground)',*/}
          {/*        }}*/}
          {/*        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}*/}
          {/*        onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}*/}
          {/*    >*/}
          {/*        Browse Events*/}
          {/*    </button>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  )
}
