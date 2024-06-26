'use client'

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { GiftBoxColumn, columns } from "./columns";



interface GiftBoxTableAreaProps {
    data: GiftBoxColumn[]
}

const GiftBoxTableArea = ({ data }: GiftBoxTableAreaProps) => {

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Gift Boxes (${data.length})`}
                    description="Manage your Gift Boxes here."
                />
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={data}
                searchKey="name"
            />
            <Separator />
        </>
    );
}

export default GiftBoxTableArea;