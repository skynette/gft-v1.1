'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import AdminCreateBoxForm from "./create-box-form"

interface BoxSheetProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminBoxResponse
}
export const BoxSheet = ({ title, isOpen, initialValue, onClose }: BoxSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    <AdminCreateBoxForm initialValue={initialValue} onClose={onClose} />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}