'use client'

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface GiftBoxTableAreaProps<TData, TValue> {
    title: string;
    columns: any;
    data: TData[];
}

export function GiftBoxTableArea<TData, TValue>({ title, columns, data }: GiftBoxTableAreaProps<TData, TValue>) {

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