'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import LoadingSkeleton from '@/components/skeleton'
import { columns } from './components/columns'
import { useGetAdminGifts } from '@/lib/hooks/admin-hooks'
import { GiftSheet } from './components/gift-sheet'

export default function GiftsPage() {
    const [openSheet, setIsOpenSheet] = useState(false);
    const { data, isPending, isSuccess } = useGetAdminGifts();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Gifts`}
                    description="Manage Gifts here."
                />
                <Button onClick={() => setIsOpenSheet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Gift
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

            <GiftSheet title='Create Gift' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
