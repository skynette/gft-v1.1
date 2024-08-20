import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { getCurrentUser } from '@/lib/actions';
import type { Metadata } from 'next';
import { User } from '../../../../types';

export const metadata: Metadata = {
  title: 'GFT - Company Admin',
  description: 'Company Admin Dashboard'
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
        <Sidebar />
        <main className="flex-1 mt-10">{children}</main>
      </div>
    </>
  );
}
