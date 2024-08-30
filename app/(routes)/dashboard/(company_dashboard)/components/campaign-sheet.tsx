'use client'

import CreateCampaignForm from "@/components/forms/CreateCampaignForm"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CampaignColumns } from "./campaign-columns"
import { createQueryString } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

interface CampaignSheetProps {
    title: string
    isOpen: boolean
    onClose: () => void
    initialValue?: CampaignColumns
}
export const CampaignSheet = ({ title, isOpen, onClose, initialValue }: CampaignSheetProps) => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="min-w-[50%] overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <CreateCampaignForm />
            </SheetContent>
        </Sheet >
    )
}