import { Separator } from '@/components/ui/separator'
import { User } from 'lucide-react'
import ProfileForm from '../../components/profile/profile-form'
import SidebarNav from '@/components/sidebar-nav'

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin',
    description: ''
};

const sidebarNavItems = [
    {
        title: 'Profile',
        icon: <User className='w-5 h-5' />,
        href: '/dashboard/gifter/settings',
    }
]

export default function GifterSettings() {
    return (
        <>
            <div className='container space-y-0.5 pt-16'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                    Settings
                </h1>
                <p className='text-muted-foreground'>
                    Manage your account settings and set e-mail preferences. lol
                </p>
            </div>
            <Separator className='my-6' />
            <div className='container flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0'>
                <aside className='sticky top-0 lg:w-1/5'>
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className='w-full p-1 pr-4 lg:max-w-xl'>
                    <div className='pb-16'>
                        <div className='space-y-6'>
                            <div>
                                <h3 className='text-lg font-medium'>Profile</h3>
                                <p className='text-sm text-muted-foreground'>
                                    This is how others will see you on the site.
                                </p>
                            </div>
                            <Separator className='my-4' />
                            <ProfileForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



