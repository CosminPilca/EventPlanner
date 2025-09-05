import Link from 'next/link'
import { classNames } from '@/utils/ClassNames'

interface AdminLinkCardProps {
  href: string
  title: string
  description: string
  variant?: 'blue' | 'green' | 'purple' | 'red'
  className?: string
}

const variantStyles = {
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-green-600 hover:bg-blue-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  red: 'bg-red-600 hover:bg-red-700',
}

export default function AdminLinkCard({
  href,
  title,
  description,
  variant = 'blue',
  className = '',
}: AdminLinkCardProps) {
  return (
    <Link
      href={href}
      className={classNames(
        'text-white p-6 rounded-lg text-center transition-colors duration-200',
        variantStyles[variant],
        className
      )}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2">{description}</p>
    </Link>
  )
}
