import Link from 'next/link';
import { classNames } from '@/utils/ClassNames'

interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    fullWidth?: boolean;
}

const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
};

const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
};

export default function LinkButton({
                                       href,
                                       children,
                                       variant = 'primary',
                                       size = 'md',
                                       className = '',
                                       fullWidth = false
                                   }: LinkButtonProps) {
    return (
        <Link
            href={href}
            className={classNames(
                'font-medium rounded-lg transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'inline-block text-center',
                variantStyles[variant],
                sizeStyles[size],
                fullWidth && 'w-full',
                className
            )}
        >
            {children}
        </Link>
    );
}