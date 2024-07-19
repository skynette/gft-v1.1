'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import LoadingSkeleton from '@/components/skeleton'
import { useGetAdminCompanyBoxes } from '@/lib/hooks/admin-hooks'
import { columns } from './components/columns'

export default function CompanyBoxesPage() {
    const [openSheet, setIsOpenSheet] = useState(false);
    const { data, isPending, isSuccess } = useGetAdminCompanyBoxes();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Company Boxes`}
                    description="Manage Company Boxes here."
                />
                <Button onClick={() => setIsOpenSheet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Company Boxes
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

            {/* <CompanySheet title='Create Box Category' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} /> */}
        </div>
    )
}
