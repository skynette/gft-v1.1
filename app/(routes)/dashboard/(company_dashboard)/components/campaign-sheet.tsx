'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface CampaignSheetProps {
    isOpen: boolean
    onClose: () => void
}
export const CampaignSheet = ({isOpen, onClose}: CampaignSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%]">
                <SheetHeader>
                    <SheetTitle>
                        Create Campaign
                    </SheetTitle>
                    <SheetDescription>
                        Manage Campaign
                    </SheetDescription>
                </SheetHeader>
                
            </SheetContent>
        </Sheet >
    )
}