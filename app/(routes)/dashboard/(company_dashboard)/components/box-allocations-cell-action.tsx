'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { createQueryString } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { BoxAllocation } from "@/lib/response-type/company_dashboard/BoxAllocationResponse"
import { BoxAllocationSheet } from "./box-allocation-sheet"

interface CellActionProps {
    data: BoxAllocation
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [openSheet, setIsOpenSheet] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('copied.')
    }
    return (
        <>
            <BoxAllocationSheet
                isOpen={openSheet}
                title="Update Box Allocation"
                initialValue={data}
                onClose={() => {
                    setIsOpenSheet(false);
                    createQueryString(pathname, router, 'query', '');
                }} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => {
                        createQueryString(pathname, router, 'query', 'update');
                        setIsOpenSheet(true);
                    }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}