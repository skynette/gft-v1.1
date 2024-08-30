'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import LoadingSkeleton from '@/components/skeleton'
import useGetBoxAllocations from '@/lib/hooks/useGetBoxAllocations'
import { columns } from '../components/box-allocations-columns'
import { BoxAllocationSheet } from '../components/box-allocation-sheet'

export default function BoxAllocations() {
    const [openSheet, setIsOpenSheet] = useState(false);

    const { data: boxAlllocations, isPending, isSuccess } = useGetBoxAllocations();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Box Allocations`}
                    description="Manage your allocations here."
                />
                {/* <Button onClick={() => setIsOpenSheet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Box Allocation
                </Button> */}
            </div>
            <Separator className='my-4'/>
            {isPending && <LoadingSkeleton />}
            {
                isSuccess &&
                <DataTable
                    columns={columns}
                    data={boxAlllocations ?? []}
                    disabled={false}
                />
            }

            <BoxAllocationSheet title='Add box allocation' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
