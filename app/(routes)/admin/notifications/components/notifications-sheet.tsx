'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import AdminCreateNotificationForm from "./create-notification-form"

interface NotificationPageProps {
    isOpen: boolean
    title: string
    onClose: () => void
    initialValue?: AdminNotificationsResponse
}
export const NotificationSheet = ({ title, isOpen, initialValue, onClose }: NotificationPageProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="min-w-[50%] overflow-scroll">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                    <AdminCreateNotificationForm initialValue={initialValue} onClose={onClose} />
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}