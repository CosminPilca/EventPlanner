import Link from 'next/link';
import { classNames } from '@/utils/ClassNames';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function NavLink({ href, children, className = '' }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={classNames(
                "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                className
            )}
        >
            {children}
        </Link>
    );
}

