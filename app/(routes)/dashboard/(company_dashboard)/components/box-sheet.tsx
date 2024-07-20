'use client'

import CreateBoxForm from "@/components/forms/CreateBoxForm"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { BoxResponse } from "@/lib/response-type/company_dashboard/BoxesRespose"

interface BoxSheetProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: BoxResponse
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
                    <CreateBoxForm initialValue={initialValue} onClose={onClose} />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}