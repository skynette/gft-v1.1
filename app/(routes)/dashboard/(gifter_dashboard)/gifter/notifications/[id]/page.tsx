'use client';

import { Button } from "@/components/ui/button";
import useNotifications from "@/lib/hooks/useGetNotifications";
import useMarkNotificationAsRead from "@/lib/hooks/useMarkNotificationAsRead";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

function ArrowLeftIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}

const NotificationDetail = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data } = useNotifications();
    const notificationId = useParams().id;
    const notification = data?.find(item => item.id.toString() === notificationId);

    const { mutate, isPending } = useMarkNotificationAsRead({
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    return (
        <div className="container flex flex-col">
            <div className="bg-primary px-4 md:px-6 py-3 flex items-center justify-between">
                <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeftIcon className="w-5 h-5 text-white" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="text-lg text-white font-medium">Notification Details</h1>
                <Button isLoading={isPending} disabled={isPending || notification?.read} onClick={() => mutate(notificationId)} variant="secondary" size="sm">
                    {notification?.read ? 'read' : 'Mark as read'}
                </Button>
            </div>
            <main className="flex-1 p-4 md:p-6">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">{notification?.gift.gift_title}</h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            {notification?.message}.
                        </p>
                        <p>{new Date(notification?.timestamp!).toLocaleString()}.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default NotificationDetail;