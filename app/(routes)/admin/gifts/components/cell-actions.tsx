'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { createQueryString } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { GiftSheet } from "./gift-sheet"
import { useAdminDeleteGift } from "@/lib/hooks/admin-hooks"

interface CellActionProps {
    data: AdminGiftResponse
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const pathname = usePathname();
    const client = useQueryClient()
    const [openSheet, setIsOpenSheet] = useState(false)
    const [openAlert, setIsOpenAlert] = useState(false)

    const { mutate, isPending } = useAdminDeleteGift({
        onSuccess() {
            client.invalidateQueries({ queryKey: ['admin-gifts'] })
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
                onConfirm={() => mutate(data.id.toString())}
                loading={isPending}
            />
            <GiftSheet
                isOpen={openSheet}
                title="Update box"
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
                    <DropdownMenuItem onClick={() => onCopy(data.id.toString())}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
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