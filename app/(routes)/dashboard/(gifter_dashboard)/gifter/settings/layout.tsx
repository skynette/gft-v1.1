import { Separator } from '@/components/ui/separator'
import { BellRing, Monitor, Palette, Settings, User } from 'lucide-react'
import SidebarNav from '@/components/sidebar-nav'

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin',
    description: ''
};

export default function GifterSettings({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className='space-y-0.5'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                    Settings
                </h1>
                <p className='text-muted-foreground'>
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>
            <Separator className='my-6' />
            <div className='flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0'>
                <aside className='sticky top-0 lg:w-1/5'>
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className='w-full p-1 pr-4 lg:max-w-xl'>
                    <div className='pb-16'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

const sidebarNavItems = [
    {
        title: 'Profile',
        icon: <User className='w-5 h-5' />,
        href: '/dashboard/gifter/settings',
    },
    {
        title: 'Account',
        icon: <Settings className='w-5 h-5' />,
        href: '/dashboard/gifter/settings/account',
    },
    {
        title: 'Appearance',
        icon: <Palette className='w-5 h-5' />,
        href: '/dashboard/gifter/settings/appearance',
    },
    {
        title: 'Notifications',
        icon: <BellRing className='w-5 h-5' />,
        href: '/dashboard/gifter/settings/notifications',
    },
    {
        title: 'Display',
        icon: <Monitor className='w-5 h-5' />,
        href: '/dashboard/gifter/settings/display',
    }
]
