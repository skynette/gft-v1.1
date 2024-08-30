'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import LoadingSkeleton from '@/components/skeleton'
import { useGetAdminCampaigns } from '@/lib/hooks/admin-hooks'
import { columns } from './components/columns'
import { CampaignSheet } from './components/campaign-sheet'
import { useRouter } from 'next/navigation'

export default function CampaignPage() {
    const [openSheet, setIsOpenSheet] = useState(false);
    const { data, isPending, isSuccess } = useGetAdminCampaigns();
    const router = useRouter()

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Campaigns`}
                    description="Manage your campaigns here."
                />
                <Button onClick={() => router.push(`/admin/campaigns/create`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
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

            <CampaignSheet title='Create Campaign' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
