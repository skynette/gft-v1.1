import GifterHeader from '@/components/layout/header-gifter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'GFT - Gifter',
    description: ''
};

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
