'use client';

import LoadingSkeleton from '@/components/skeleton'
import { Heading } from '@/components/ui/heading'
import { useGetAdminPermissionGroups } from '@/lib/hooks/admin-hooks'
import React from 'react'
import { columns } from './components/columns'
import { DataTable } from '@/components/ui/data-table'

const page = () => {
    const { isPending, data, isSuccess } = useGetAdminPermissionGroups()

    return (
        <div className='p-10'>
            <Heading
                title='Permission Groups'
                description="Manage users permission"
            />

            {isPending && <LoadingSkeleton />}
            {
                isSuccess &&
                <DataTable
                    columns={columns}
                    data={data ?? []}
                    disabled={false}
                />
            }
        </div>
    )
}

export default page