"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from './cell-action'
import { ArrowUpDown } from "lucide-react"
import { format } from 'date-fns'

export type GiftBoxColumn = {
    id: string
    name: string
    owner: string
    receiver_email: string
    days_of_gifting: string
    receiver_name: string
    open_date: string
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
        accessorKey: "owner",
        header: "Owner",
    },
    {
        accessorKey: "days_of_gifting",
        header: "Days of Gifting",
    },
    {
        accessorKey: "receiver_name",
        header: "Receiver Name",
    },
    {
        accessorKey: "open_date",
        header: "Open Date",
        cell: ({ row }) => format(new Date(row.original.open_date), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.createdAt), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
