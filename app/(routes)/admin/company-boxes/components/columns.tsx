"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { CellAction } from "./cell-actions"

export const columns: ColumnDef<AdminCompanyBoxResponse>[] = [
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
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => row.original.company.name
    },
    {
        accessorKey: "qty",
        header: "Quantity available",
    },
    {
        accessorKey: "box_type",
        header: "Box Type",
        cell: ({ row }) => row.original.box_type.name
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
