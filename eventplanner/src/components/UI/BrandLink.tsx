import Link from 'next/link'

interface BrandLinkProps {
  href: string
  children: React.ReactNode
}

export default function BrandLink({ href, children }: BrandLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 font-bold text-xl hover:opacity-80 transition-opacity"
    >
      {children}
    </Link>
  )
}
