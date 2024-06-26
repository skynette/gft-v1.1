import { Separator } from '@/components/ui/separator'
import AccountForm from './account-form'

export default function AccountSettingsPage() {
    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-lg font-medium'>Account Settings</h3>
                <p className='text-sm text-muted-foreground'>
                    Manage account settings
                </p>
            </div>
            <Separator className='my-4' />
            <AccountForm />
        </div>
    )
}
