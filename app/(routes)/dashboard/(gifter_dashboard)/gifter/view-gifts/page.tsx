'use client';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useGetMinibox from "@/lib/hooks/useGetMinibox";
import { MiniboxResponse } from "@/lib/response-type/gifter/MiniboxResponse";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { differenceInDays, format, parseISO } from "date-fns";
import { Gift, Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ViewGifts = () => {
    const boxId = useSearchParams().get('boxId') ?? '';
    const { data: giftsReceived, isPending, error, isError } = useGetMinibox(boxId);
    const [openDialog, setOpenDialog] = useState(false);
    const [openGift, setOpenGift] = useState<MiniboxResponse | null>();

    if (isError)
        toast.error(error?.message);

    if (isPending)
        return (
            <div className="flex flex-col py-10 items-center justify-center">
                <Loader className="mr-2 h-8 w-8 animate-spin" />
                <p className="font-sm">Fetching gift boxes...</p>
            </div>
        )

    return (
        <div className="container flex flex-col py-10">
            <p className="text-2xl font-semibold">Gift boxes received</p>
            <div className="grid grid-cols-4 gap-4 mt-2">
                {
                    giftsReceived?.map(gift => (
                        <div key={gift.id} className="flex flex-col space-y-2 p-2 items-center justify-center text-center rounded-lg border">
                            <Gift size={64} />

                            <p className="font-semibold">{gift.gift_title}</p>
                            <p className="text-gray-500 text-sm font-normal">
                                Gift owned by: <span className="text-black font-medium">{gift.box_model.owner}</span>
                            </p>
                            <p className="text-gray-500 text-sm font-normal">
                                Open date: <span className="text-black font-medium">{format(parseISO(gift.open_date), 'dd-MM-yyyy')}</span>
                            </p>

                            <AlertDialog defaultOpen={openDialog} onOpenChange={setOpenDialog}>
                                <AlertDialogTrigger>
                                    <Button variant='outline' className="" onClick={() => {
                                        const shouldOpen = differenceInDays(
                                            parseISO(gift.open_date),
                                            new Date().toISOString(),
                                        );

                                        if (shouldOpen <= 0) {
                                            setOpenGift(gift);
                                            setOpenDialog(true);
                                        } else toast.info('Not yet open date for gift box');
                                    }}>Open</Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Giftbox</AlertDialogTitle>
                                        <AlertDialogDescription></AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex flex-col">
                                        <p className="text-gray-500 text-sm">Gift title: <span className="text-black">{openGift?.box_model.title}</span></p>
                                        <p className="text-gray-500 text-sm">Gift owner: <span className="text-black">{openGift?.box_model.owner}</span></p>
                                        <p className="text-gray-500 text-sm">Receiver name: <span className="text-black">{openGift?.box_model.receiver_name}</span></p>
                                        <p className="text-gray-500 text-sm">Receiver email: <span className="text-black">{openGift?.box_model.receiver_email}</span></p>
                                        <p className="text-gray-500 text-sm">Receiver phone number: <span className="text-black">{openGift?.box_model.receiver_phone}</span></p>
                                        <p className="text-gray-500 text-sm">Open date: <span className="text-black">{format(parseISO(openGift?.box_model.open_date ?? new Date().toISOString()), 'dd-MM-yyyy')}</span></p>
                                        <p className="text-gray-500 text-sm">Gift created at: <span className="text-black">{format(parseISO(openGift?.box_model.created_at ?? new Date().toISOString()), 'dd-MM-yyyy')}</span></p>
                                        <p className="text-gray-500 text-sm">Gift last updated at: <span className="text-black">{format(parseISO(openGift?.box_model.updated_at ?? new Date().toISOString()), 'dd-MM-yyyy')}</span></p>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ViewGifts;