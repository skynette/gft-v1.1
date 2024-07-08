'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { columns } from '../components/box-columns'
import { mockData } from '@/constants/data'
import { BoxSheet } from '../components/box-sheet'
import useGetCompanyBox from '@/lib/hooks/useGetCompanyBox'

export default function BoxPage() {
    const [openSheet, setIsOpenSheet] = useState(false);

    const { data: companyBox } = useGetCompanyBox();
    console.log(companyBox);

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
            <Separator />
            <DataTable
                columns={columns}
                data={mockData}
                searchKey="title"
                disabled={false}
            // onDelete={() => {}}
            />

            <BoxSheet isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
