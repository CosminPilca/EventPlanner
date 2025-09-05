'use client';

import UnauthorizedAccess from '@/components/UI/UnauthorizedAccess';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UnauthorizedPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const requiredRole = searchParams.get('role') || 'ADMIN';
    const redirectPath = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', '/unauthorized');
        }
    }, []);

    const handleGoHome = () => {
        if (redirectPath.startsWith('/admin')) {
            router.push('/');
        } else {
            router.push(redirectPath);
        }
    };

    return (
        <UnauthorizedAccess
            requiredRole={requiredRole}
            redirectPath="/"
            // @ts-ignore
            onGoHome={handleGoHome}
        />
    );
}