"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from 'date-fns'
import { Check, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next13-progressbar"

export const columns: ColumnDef<AdminPermissionGroupResponse>[] = [
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
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => {
            return <p>{row.original.permissions.length}</p>
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const router = useRouter();
            return <Button onClick={() => {
                router.push(`/admin/permission-groups/${row.original.id}`);
            }}>
                <Eye className="w-4 h-4" />
            </Button>
        }
    },
]
