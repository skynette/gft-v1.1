'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { columns } from '../components/campaign-columns'
import { useState } from 'react'
import { CampaignSheet } from '../components/campaign-sheet'
import useGetCompanyCampaign from '@/lib/hooks/useGetCompanyCampaigns'
import LoadingSkeleton from '@/components/skeleton'
import { useRouter } from 'next/navigation'

export default function CampaignsPage() {
    const [openSheet, setIsOpenSheet] = useState(false);
    const { data: companyCampaigns, isPending, isSuccess } = useGetCompanyCampaign();
    const router = useRouter()

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Campaigns`}
                    description="Manage your Campaigns here."
                />
                <Button onClick={() => router.push(`/dashboard/campaigns/create`)}>
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
                    data={companyCampaigns ?? []}
                />
            }
            <CampaignSheet title='Create Campaign' isOpen={openSheet} onClose={() => setIsOpenSheet(false)} />
        </div>
    )
}
