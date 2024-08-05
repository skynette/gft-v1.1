'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import AdminCreateUserForm from "./create-user-form"

interface GiftPageProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminUserResponse
}
export const UserSheet = ({ title, isOpen, initialValue, onClose }: GiftPageProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    <AdminCreateUserForm initialValue={initialValue} onClose={onClose} />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}