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
      <div className="flex h-screen overflow-hidden">
        layout for gifter 
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}
