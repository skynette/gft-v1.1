'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface CampaignProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminCampaignResponse
}
export const CampaignSheet = ({ title, isOpen, initialValue, onClose }: CampaignProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    {/* <AdminCreateCampaignForm initialValue={initialValue} onClose={onClose} /> */}
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}