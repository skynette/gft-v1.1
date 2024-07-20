'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface TemplatesPageProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminTemplatesResponse
}
export const TemplatesSheet = ({ title, isOpen, initialValue, onClose }: TemplatesPageProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    {/* <TemplatesCreateForm initialValue={initialValue} onClose={onClose} /> */}
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}