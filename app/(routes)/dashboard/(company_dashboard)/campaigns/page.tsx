'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { columns } from '../components/campaign-columns'
import { useState } from 'react'
import { CampaignSheet } from '../components/campaign-sheet'

export default function CampaignsPage() {
    const [openSheet, setIsOpenSheet] = useState(false)

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Campaigns`}
                    description="Manage your Campaigns here."
                />
                <Button onClick={() => setIsOpenSheet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={[]}
                searchKey="name"
            />
        <CampaignSheet isOpen={openSheet} onClose={() => setIsOpenSheet(false)}/>
        </div>
    )
}
