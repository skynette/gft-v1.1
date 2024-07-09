'use client'

import CreateBoxForm from "@/components/forms/CreateBoxForm"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface BoxSheetProps {
    isOpen: boolean
    onClose: () => void
}
export const BoxSheet = ({ isOpen, onClose }: BoxSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        Create Box
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    <CreateBoxForm />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}