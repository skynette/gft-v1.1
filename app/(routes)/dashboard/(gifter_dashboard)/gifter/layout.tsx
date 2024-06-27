'use client';

import GifterHeader from '@/components/layout/header-gifter';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <GifterHeader />
            <main className="pt-16">{children}</main>
        </>
    );
}
