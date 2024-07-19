"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from 'date-fns'
import { Checkbox } from "@/components/ui/checkbox"
import { CellAction } from "./cell-actions"


export const columns: ColumnDef<AdminBoxCategoryResponse>[] = [
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
        accessorKey: "id",
        header: "id",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "label",
        header: "Label",
    },
    {
        accessorKey: "category",
        header: "Category",
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
