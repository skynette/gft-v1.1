'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import AdminCompanyBoxCreateForm from "./create-company-boxes-form"

interface CompanyPageProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminCompanyBoxResponse
}
export const CompanyBoxSheet = ({ title, isOpen, initialValue, onClose }: CompanyPageProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    <AdminCompanyBoxCreateForm initialValue={initialValue} onClose={onClose} />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}