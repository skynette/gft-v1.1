'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, MoreHorizontal, Trash } from "lucide-react"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useAdminDeleteToken } from "@/lib/hooks/admin-hooks"

interface CellActionProps {
    data: TokenResponse
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const client = useQueryClient()
    const [openAlert, setIsOpenAlert] = useState(false)

    const { mutate, isPending } = useAdminDeleteToken({
        onSuccess() {
            client.invalidateQueries({ queryKey: ['admin-tokens'] })
            toast.success('deleted successfully.')
            setIsOpenAlert(false)
        },
        onError(error) {
            toast.error("deletion failed")
            setIsOpenAlert(false)
        },
    });

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('copied.')
    }

    return (
        <>
            <AlertModal
                isOpen={openAlert}
                onClose={() => setIsOpenAlert(false)}
                onConfirm={() => mutate(data.key)}
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
                    <DropdownMenuItem onClick={() => onCopy(data.key)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy token
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsOpenAlert(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}