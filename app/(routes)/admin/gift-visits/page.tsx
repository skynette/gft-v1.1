'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import LoadingSkeleton from '@/components/skeleton'
import { columns } from './components/columns'
import { useGetAdminGiftVisits } from '@/lib/hooks/admin-hooks'
import { GiftVisitSheet } from './components/gift-visit-sheet'

export default function GiftVisitPage() {
    const [openSheet, setIsOpenSheet] = useState(false);
    const { data, isPending, isSuccess } = useGetAdminGiftVisits();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Gift Visits`}
                    description="Manage Gift Visits here."
                />
                <Button onClick={() => setIsOpenSheet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Gift Visit
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

            <GiftVisitSheet title='Create Visit' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
