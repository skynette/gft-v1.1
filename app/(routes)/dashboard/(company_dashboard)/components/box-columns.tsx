"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from 'date-fns'
import { CellAction } from "./box-cell-action"
import { Checkbox } from "@/components/ui/checkbox"
import { BoxResponse } from "@/lib/response-type/company_dashboard/BoxesRespose"

export type BoxColumn = {
    user: number
    owner: string
    days_of_gifting: string
    box_campaign: number
    box_campaign_deleted_status: boolean
    id: string
    created_at: string
    updated_at: string
    title: string
    receiver_name: string
    receiver_email: string
    receiver_phone: string
    open_date: string
    last_opened: any
    is_setup: boolean
    is_company_setup: boolean
    open_after_a_day: boolean
}


export const columns: ColumnDef<BoxResponse>[] = [
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
        header: ({ column }) => {
            return (
                <div
                    className="flex cursor-pointer w-fit"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Owner
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
        accessorKey: "title",
        header: "Title",
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
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
