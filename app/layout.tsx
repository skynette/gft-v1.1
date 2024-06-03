'use client';

import './globals.css'
import { Epilogue } from "next/font/google"


const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'fallback',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className=''>
                {children}
            </body>
        </html>
    )
}
