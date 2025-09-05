import Link from 'next/link'
import { classNames } from '@/utils/ClassNames'

interface LinkButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}

const variantStyles = {
  primary:
    'border border-transparent theme-transition focus:ring-2 focus:ring-offset-2 hover:brightness-90',
  secondary:
    'bg-theme-secondary border border-theme-secondary text-theme-secondary hover-theme-bg theme-transition focus:ring-2 focus:ring-offset-2',
  ghost:
    'text-theme-secondary hover-theme-bg bg-transparent border-transparent theme-transition',
  danger:
    'border border-transparent theme-transition focus:ring-2 focus:ring-offset-2 hover:brightness-90',
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
}

export default function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
}: LinkButtonProps) {
  const getVariantStyle = () => {
    const baseStyle: React.CSSProperties = {
      transition: 'all 0.2s ease',
      outline: 'none',
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)',
        }
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-secondary-foreground)',
          borderColor: 'var(--color-border)',
        }
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
        }
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-destructive)',
          color: 'var(--color-destructive-foreground)',
        }
      default:
        return baseStyle
    }
  }

  return (
    <Link
      href={href}
      className={classNames(
        'font-medium rounded-lg transition-all duration-200',
        'focus:outline-none inline-block text-center',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      style={getVariantStyle()}
    >
      {children}
    </Link>
  )
}
