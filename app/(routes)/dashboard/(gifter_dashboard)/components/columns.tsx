"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from './cell-action'
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export type GiftBoxColumn = {
    id: string
    name: string
    createdAt: string
}

export const columns: ColumnDef<GiftBoxColumn>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div
                className="flex cursor-pointer w-fit"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
