'use client';
import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { adminNavItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/lib/hooks/useSidebar';

type SidebarProps = {
    className?: string;
};

export default function AdminSidebar({ className }: SidebarProps) {
    const { isMinimized, toggle } = useSidebar();
    const [status, setStatus] = useState(false);

    const handleToggle = () => {
        setStatus(true);
        toggle();
        setTimeout(() => setStatus(false), 500);
    };
    return (
        <nav
            className={cn(
                `relative hidden min-h-screen flex-none border-r z-10 md:block mt-10`,
                status && 'duration-500',
                !isMinimized ? 'w-72' : 'w-[72px]',
                className
            )}
        >
            <ChevronLeft
                className={cn(
                    'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
                    isMinimized && 'rotate-180'
                )}
                onClick={handleToggle}
            />
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mt-3 space-y-1">
                        <DashboardNav items={adminNavItems} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
