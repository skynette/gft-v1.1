'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import LoadingSkeleton from '@/components/skeleton'
import { columns } from './components/columns'
import { BoxSheet } from './components/box-sheet'
import { useGetAdminBoxes } from '@/lib/hooks/admin-hooks'

export default function BoxPage() {
    const [openSheet, setIsOpenSheet] = useState(false);
    const { data, isPending, isSuccess } = useGetAdminBoxes();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Boxes`}
                    description="Manage your boxes here."
                />
                <Button onClick={() => setIsOpenSheet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Box
                </Button>
            </div>
            <Separator className='my-4' />
            {isPending && <LoadingSkeleton />}
            {
                isSuccess &&
                <DataTable
                    columns={columns}
                    data={data ?? []}
                    searchKey="title"
                    disabled={false}
                />
            }

            <BoxSheet title='Create box' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
