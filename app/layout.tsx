'use client';

import './globals.css';
import { Epilogue } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'fallback',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={epilogue.className}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    )
}
