import Link from 'next/link'
import { classNames } from '@/utils/ClassNames'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function NavLink({
  href,
  children,
  className = '',
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={classNames(
        'text-theme-secondary hover-theme-bg theme-transition px-3 py-2 rounded-md',
        'hover:opacity-80 transition-all duration-200',
        className
      )}
      style={{
        color: 'var(--color-text-secondary)',
        transition: 'all 0.2s ease',
      }}
    >
      <span className="hover:text-theme-primary theme-transition">
        {children}
      </span>
    </Link>
  )
}
