'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import LoadingSkeleton from '@/components/skeleton'
import useGetCompanyUsers from '@/lib/hooks/useGetCompanyUser'
import { columns } from '../components/company-users-column'

export default function CampaignsPage() {
    const { data: companyUsers, isPending, isSuccess } = useGetCompanyUsers();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Users`}
                    description="Manage Users."
                />
            </div>
            <Separator className='my-4' />
            {isPending && <LoadingSkeleton />}
            {
                isSuccess &&
                <DataTable
                    columns={columns}
                    data={companyUsers ?? []}
                />
            }
        </div>
    )
}
