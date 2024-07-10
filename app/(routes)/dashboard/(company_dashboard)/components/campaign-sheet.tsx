'use client'

import CreateCampaignForm from "@/components/forms/CreateCampaignForm"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface CampaignSheetProps {
    isOpen: boolean
    onClose: () => void
}
export const CampaignSheet = ({ isOpen, onClose }: CampaignSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>
                        Create Campaign
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <CreateCampaignForm onClose={onClose} />
            </SheetContent>
        </Sheet >
    )
}