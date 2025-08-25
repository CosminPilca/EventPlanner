'use client'
import {ThemeProvider} from "next-themes";


// @ts-ignore
export const StyleProvider: React.PropsWithChildren<any> = ({children}) => {
    return (
        <ThemeProvider attribute = "class" defaultTheme="system" enableSystem={true} disableTransitionOnChange={true}>
            {children}
            </ThemeProvider>
    )
}

export default StyleProvider;