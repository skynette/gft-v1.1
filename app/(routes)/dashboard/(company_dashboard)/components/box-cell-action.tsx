'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"
import { toast } from "sonner"
import { BoxColumn } from "./box-columns"
import useDeleteBox from "@/lib/hooks/useDeleteBox"
import { useQueryClient } from "@tanstack/react-query"

interface CellActionProps {
    data: BoxColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const client = useQueryClient()
    const [open, setOpen] = useState(false)
    const { mutate, isPending } = useDeleteBox({
        onSuccess() {
            client.invalidateQueries({ queryKey: ['company-box'] })
            toast.success('deleted successfully.')
            setOpen(false)
        },
        onError(error) {
            toast.error("deletion failed")
            setOpen(false)
        },
    });

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('copied.')
    }
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => mutate(data.id)}
                loading={isPending}
            />
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
                    <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}