'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import LoadingSkeleton from '@/components/skeleton'
import { useGetAdminTokens } from '@/lib/hooks/admin-hooks'
import { columns } from './components/columns'

export default function TokensPage() {
    const { data, isPending, isSuccess } = useGetAdminTokens();

    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Tokens`}
                    description="Manage your Auth Tokens here."
                />
            </div>
            <Separator className='my-4' />
            {isPending && <LoadingSkeleton />}
            {
                isSuccess &&
                <DataTable
                    columns={columns}
                    data={data?.results ?? []}
                    searchKey="visitor"
                    disabled={false}
                />
            }
        </div>
    )
}
