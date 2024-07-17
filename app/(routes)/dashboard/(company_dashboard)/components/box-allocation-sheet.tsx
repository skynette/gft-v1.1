'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { BoxAllocation } from "@/lib/response-type/company_dashboard/BoxAllocationResponse"

interface BoxAllocationSheetProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: BoxAllocation
}
export const BoxAllocationSheet = ({ title, isOpen, initialValue, onClose }: BoxAllocationSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    {/* <AddBoxAllocationForm initialValue={initialValue} onClose={onClose} /> */}
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}