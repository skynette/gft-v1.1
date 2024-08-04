'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import AdminCreateGiftVisitForm from "./gift-visit-create-form"

interface GiftPageProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminGiftVisitsResponse
}
export const GiftVisitSheet = ({ title, isOpen, initialValue, onClose }: GiftPageProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    <AdminCreateGiftVisitForm initialValue={initialValue} onClose={onClose} />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}