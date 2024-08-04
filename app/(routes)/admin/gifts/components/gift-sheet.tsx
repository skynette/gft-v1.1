'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import AdminCreateGiftForm from "./create-gift-form"

interface GiftPageProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminGiftRequest
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
                    <AdminCreateGiftForm initialValue={initialValue} onClose={onClose} />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}