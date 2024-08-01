'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import AdminCreateBoxCategoryForm from "./create-box-category-form"

interface BoxCategoryProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminBoxCategoryResponse
}
export const BoxCategorySheet = ({ title, isOpen, initialValue, onClose }: BoxCategoryProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    <AdminCreateBoxCategoryForm initialValue={initialValue} onClose={onClose} />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}