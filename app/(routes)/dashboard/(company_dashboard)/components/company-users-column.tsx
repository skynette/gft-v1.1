"use client"

import { CompanyUserResponse } from "@/lib/response-type/company_dashboard/CompanyUserResponse";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckIcon, X } from "lucide-react"

export const columns: ColumnDef<CompanyUserResponse>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <div
                    className="flex cursor-pointer w-fit"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => row.original.user.username ?? 'N/A'
    },
    {
        accessorKey: "first_name",
        header: "First Name",
        cell: ({ row }) => row.original.user.first_name ?? 'N/A'
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.user.email ?? 'N/A'
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => (row.original.user.is_active === true ? <CheckIcon className="h-5 w-5"/> : <X className="h-5 w-5"/>)
    },
];
