"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { CellAction } from "./cell-actions"


export const columns: ColumnDef<AdminCompanyAPIKeyResponse>[] = [
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
        accessorKey: "company_name",
        header: "Company Name",
    },
    {
        accessorKey: "num_of_requests_made",
        header: "Requests Made",
    },
    {
        accessorKey: "max_requests",
        header: "Max Requests",
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => row.original.created_at
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
