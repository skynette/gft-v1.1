import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { columns } from '../components/campaign-columns'

export default function CampaignsPage() {
    return (
        <div className='p-10'>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Campaigns`}
                    description="Manage your Campaigns here."
                />
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={[]}
                searchKey="name"
            />
        </div>
    )
}
