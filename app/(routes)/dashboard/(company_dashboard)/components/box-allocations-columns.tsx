"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from 'date-fns'
import { BoxAllocation } from "@/lib/response-type/company_dashboard/BoxAllocationResponse"
import { CellAction } from "./box-allocations-cell-action"

export const columns: ColumnDef<BoxAllocation>[] = [
    {
        accessorKey: "id",
        header: "id",
    },
    {
        accessorKey: "box_type",
        header: ({ column }) => {
            return (
                <div
                    className="flex cursor-pointer w-fit"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Box Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) => row.original.box_type.name
    },
    {
        accessorKey: "qty",
        header: "Quantity Available",
    },
    {
        accessorKey: "created_at",
        header: "Created at",
        cell: ({ row }) => format(new Date(row.original.created_at), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
