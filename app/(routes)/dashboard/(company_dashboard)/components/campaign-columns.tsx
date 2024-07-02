"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./campaign-cell-action";

export interface CampaignColumns {
    id: string;
    company: number;
    name: string;
    company_boxes: number;
    duration: number;
    num_boxes: number;
    header_image: string;
    open_after_a_day: boolean;
}

export const columns: ColumnDef<CampaignColumns>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "company",
        header: ({ column }) => {
            return (
                <div
                    className="flex cursor-pointer w-fit"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Company
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "company_boxes",
        header: "Company Boxes",
    },
    {
        accessorKey: "duration",
        header: "Duration",
    },
    {
        accessorKey: "num_boxes",
        header: "Number of Boxes",
    },
    {
        accessorKey: "open_after_a_day",
        header: "Open After a Day",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];
