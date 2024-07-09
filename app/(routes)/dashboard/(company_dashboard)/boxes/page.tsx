'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { columns } from '../components/box-columns'
import { BoxSheet } from '../components/box-sheet'
import useGetCompanyBox from '@/lib/hooks/useGetCompanyBox'
import LoadingSkeleton from '@/components/skeleton'

export default function BoxPage() {
    const [openSheet, setIsOpenSheet] = useState(false);

    const { data: companyBox, isPending, isSuccess } = useGetCompanyBox();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Boxes`}
                    description="Manage your categories here."
                />
                <Button onClick={() => setIsOpenSheet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Box
                </Button>
            </div>
            <Separator className='my-4'/>
            {isPending && <LoadingSkeleton />}
            {
                isSuccess &&
                <DataTable
                    columns={columns}
                    data={companyBox?.results ?? []}
                    searchKey="title"
                    disabled={false}
                />
            }

            <BoxSheet isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
