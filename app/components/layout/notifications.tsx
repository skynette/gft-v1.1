'use client';

import Link from "next/link";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useNotifications from "@/lib/hooks/useGetNotifications";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BellIcon } from "lucide-react";

const Notifications = () => {
    const { data } = useNotifications();
    const unreadData = data?.filter(item => !item.read);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <BellIcon className="w-5 h-5" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[400px] p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <Button variant="ghost" size="sm">
                        Mark all as read
                    </Button>
                </div>
                <div className="space-y-4">
                    {
                        unreadData?.map(notification => (
                            <Link href={`/dashboard/gifter/notifications/${notification.id}`}>
                                <DropdownMenuItem asChild>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src="/" />
                                                <AvatarFallback>{notification.gift.box_model.owner}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-sm font-medium">{`New gift from ${notification.gift.box_model.owner}`}</h4>
                                            <p className="text-sm text-muted-foreground">{notification.gift.box_model.title}</p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            </Link>
                        ))
                    }
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Notifications;