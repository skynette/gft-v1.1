'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"
import { toast } from "sonner"
import { CampaignColumns } from "./campaign-columns"
import { CampaignSheet } from "./campaign-sheet"
import { createQueryString } from "@/lib/utils"

interface CellActionProps {
    data: CampaignColumns
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [openSheet, setIsOpenSheet] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('copied.')
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            // delete action goes here
            router.refresh()
            toast.success('deleted successfully.')
        } catch (error) {
            toast.error('Make sure you removed all products using this category before deleting it.')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <CampaignSheet title='Update Campaign' initialValue={data} isOpen={openSheet} onClose={() => {
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