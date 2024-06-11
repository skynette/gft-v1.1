'use client';

import './globals.css';
import { Epilogue } from "next/font/google";
import SessionProviderComponent from './providers/session-provider';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'fallback',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={epilogue.className}>
                <SessionProviderComponent>{children}</SessionProviderComponent>
            </body>
        </html>
    );
}