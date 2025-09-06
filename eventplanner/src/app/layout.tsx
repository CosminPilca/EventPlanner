import "./globals.css"
import StyleProvider from '@/app/StyleProvider'
import FooterLink from '@/components/UI/FooterLink'
import { AuthProvider } from '@/contexts/AuthContext'
import { getCurrentUser } from '@/lib/server-auth'
import NavigationHeader from '@/components/layout/NavigationHeader'

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const initialUser = await getCurrentUser()

  return (
    <html suppressHydrationWarning={true}>
      <head />
      <body className="theme-transition">
        <StyleProvider>
          <AuthProvider initialUser={initialUser}>
            <div className="flex flex-col min-h-screen bg-theme-primary">
              <NavigationHeader />
              <main className="flex-1 bg-theme-primary">{children}</main>

              <footer className="border-t border-theme-primary bg-theme-primary theme-transition">
                <div className="container mx-auto px-4 py-6">
                  <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                      <p className="text-sm text-theme-muted">
                        © 2025 Event Planner. Built with Next.js.
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-theme-muted">
                      <FooterLink href="/about">About</FooterLink>
                      <FooterLink href="/contact">Contact</FooterLink>
                      <FooterLink href="/privacy">Privacy</FooterLink>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </StyleProvider>
      </body>
    </html>
  )
}
