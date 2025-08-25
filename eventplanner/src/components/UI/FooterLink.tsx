import Link from 'next/link';

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function FooterLink({ href, children }: FooterLinkProps) {
    return (
        <Link
            href={href}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
            {children}
        </Link>
    );
}