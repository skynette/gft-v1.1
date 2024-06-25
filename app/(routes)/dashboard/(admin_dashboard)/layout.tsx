import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  description: ''
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        super admin layout
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}
