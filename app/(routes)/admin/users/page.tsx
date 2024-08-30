'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import LoadingSkeleton from '@/components/skeleton'
import { columns } from './components/columns'
import { useGetAdminUsers } from '@/lib/hooks/admin-hooks'
import { UserSheet } from './components/user-sheet'
import { useRouter } from 'next/navigation'

export default function UsersPage() {
    const [openSheet, setIsOpenSheet] = useState(false);
    const { data, isPending, isSuccess } = useGetAdminUsers();
    const router = useRouter()
    
    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Users`}
                    description="Manage Users here."
                />
                <Button onClick={() => router.push(`/admin/users/create`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                </Button>
            </div>
            <Separator className='my-4' />
            {isPending && <LoadingSkeleton />}
            {
                isSuccess &&
                <DataTable
                    columns={columns}
                    data={data ?? []}
                    disabled={false}
                />
            }

            <UserSheet title='Create User' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
