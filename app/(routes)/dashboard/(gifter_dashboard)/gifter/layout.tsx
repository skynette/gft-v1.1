'use client';

import GifterHeader from '@/components/layout/header-gifter';
import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <GifterHeader />
            <main className="pt-16">{children}</main>
        </SessionProvider>
    );
}
