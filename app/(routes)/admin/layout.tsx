import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { getCurrentUser } from '@/lib/actions';
import type { Metadata } from 'next';
import { User } from '../../../types';
import AdminSidebar from '@/components/layout/admin-sidebar';

export const metadata: Metadata = {
    title: 'GFT - Admin',
    description: 'Admin Dashboard'
};

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const currUser: User | undefined = await getCurrentUser();
    return (
        <>
            <div className="flex">
                {currUser && <Header currUser={currUser} />}
                <AdminSidebar />
                <main className="flex-1">{children}</main>
            </div>
        </>
    );
}
