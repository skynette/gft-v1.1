"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from 'date-fns'
import { Checkbox } from "@/components/ui/checkbox"
import { CellAction } from "./cell-actions"

export const columns: ColumnDef<AdminBoxResponse>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "owner",
        header: ({ column }) => (
            <div
                className="flex cursor-pointer w-fit"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Owner
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
        cell: ({ row }) => (
            <div>
                <div>{row.original.user.username}</div>
                <div className="text-xs text-gray-500">{row.original.id}</div>
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <div
                className="flex cursor-pointer w-fit"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
        cell: ({ row }) => (
            <div>
                <div>{row.original.title}</div>
                <div className="text-xs text-gray-500">{row.original.receiver_name}</div>
            </div>
        ),
    },
    {
        accessorKey: "days_of_gifting",
        header: "Days of Gifting",
    },
    {
        accessorKey: "open_date",
        header: "Open Date",
        cell: ({ row }) => format(new Date(row.original.open_date), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
