'use client'

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { GiftBoxColumn, columns } from "./columns";

interface GiftBoxTableAreaProps {
    title: string;
    data: GiftBoxColumn[]
}

const GiftBoxTableArea = ({ title, data }: GiftBoxTableAreaProps) => {

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
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