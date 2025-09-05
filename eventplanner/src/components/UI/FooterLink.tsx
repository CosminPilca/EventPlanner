import Link from 'next/link';

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function FooterLink({ href, children }: FooterLinkProps) {
    return (
        <Link
            href={href}
            className="text-theme-muted hover:text-theme-primary theme-transition transition-colors duration-200"
            style={{
                color: 'var(--color-text-muted)',
            }}
        >
            {children}
        </Link>
    );
}