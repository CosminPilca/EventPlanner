'use client'
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

interface StyleProviderProps {
    children: React.ReactNode;
}

export default function StyleProvider({ children }: StyleProviderProps) {
    useEffect(() => {
        const initializeTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

            document.documentElement.setAttribute('data-theme', initialTheme);
        };

        initializeTheme();
    }, []);

    return (
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={false}
            storageKey="theme"
        >
            {children}
        </ThemeProvider>
    );
}