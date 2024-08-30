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
        accessorKey: "name",
        header: ({ column }) => (
            <div
                className="flex cursor-pointer w-fit"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
        cell: ({ row }) => (
            <div>
                <div>{row.original.name}</div>
            </div>
        ),
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
        cell: ({ row }) => (
            <div className="flex justify-center items-center">
                {row.original.open_after_a_day ? (
                    <span className="text-green-500">&#10003;</span>
                ) : (
                    <span className="text-red-500">&#10007;</span>
                )}
            </div>
        ),
    },

    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];
