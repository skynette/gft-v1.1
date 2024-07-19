'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface GiftPageProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminGiftResponse
}
export const GiftSheet = ({ title, isOpen, initialValue, onClose }: GiftPageProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    {/* <AdminCompanyCreateForm initialValue={initialValue} onClose={onClose} /> */}
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}