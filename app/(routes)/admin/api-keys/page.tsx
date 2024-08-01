'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import LoadingSkeleton from '@/components/skeleton'
import { columns } from './components/columns'
import { useGetAdminCompanyAPIKeys } from '@/lib/hooks/admin-hooks'
import { APIKeySheet } from './components/api-key-sheet'

export default function CompanyBoxesPage() {
    const [openSheet, setIsOpenSheet] = useState(false);
    const { data, isPending, isSuccess } = useGetAdminCompanyAPIKeys();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Company API Keys`}
                    description="Manage Company API Keys here."
                />
                <Button onClick={() => setIsOpenSheet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Company API Key
                </Button>
            </div>
            <Separator className='my-4' />
            {isPending && <LoadingSkeleton />}
            {
                isSuccess &&
                <DataTable
                    columns={columns}
                    data={data ?? []}
                    searchKey="name"
                    disabled={false}
                />
            }

            <APIKeySheet title='Create API Key' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
