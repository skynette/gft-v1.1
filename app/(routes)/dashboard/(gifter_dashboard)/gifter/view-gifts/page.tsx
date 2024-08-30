'use client'

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, parseISO, differenceInDays } from 'date-fns';
import UAParser from 'ua-parser-js';
import { Gift, Loader, Calendar, User, Mail, Phone, Clock, Package, Heart } from 'lucide-react';
import { toast } from 'sonner';
import useGetMinibox, { useRecordGiftVisit } from "@/lib/hooks/useGetMinibox";
import { MiniboxResponse } from "@/lib/response-type/gifter/MiniboxResponse";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ViewGifts = () => {
    const boxId = useSearchParams().get('boxId') ?? '';
    const { data: giftsReceived, isPending, error, isError } = useGetMinibox(boxId);
    const [openDialog, setOpenDialog] = useState(false);
    const [openGift, setOpenGift] = useState<MiniboxResponse | null>(null);

    const { mutate: recordVisit, isPending: createVisitPending } = useRecordGiftVisit();

    const handleGiftOpen = (gift: MiniboxResponse) => {
        const parser = new UAParser(window.navigator.userAgent);
        const browserInfo = parser.getBrowser();
        const deviceInfo = parser.getDevice();
        const osInfo = parser.getOS();

        const metadata = {
            sourceCountry: 'Unknown',
            sourceIP: 'Unknown',
            sourceBrowser: `${browserInfo.name} ${browserInfo.version}`,
            sourceDeviceType: deviceInfo.type || 'Unknown',
            sourceOS: `${osInfo.name} ${osInfo.version}`,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language || 'Unknown',
            referrer: document.referrer || 'Direct',
            timestamp: new Date().toISOString(),
        };

        recordVisit({ gift_id: gift.pkid.toString(), metadata });
    };

    if (isError) {
        toast.error(error?.message);
    }

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader className="w-12 h-12 text-primary animate-spin" />
                <p className="mt-4 text-lg font-medium text-gray-600">Fetching your gift boxes...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Gift Boxes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {giftsReceived?.map(gift => (
                    <Card key={gift.id} className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <CardTitle className="flex items-center">
                                <Gift className="mr-2" size={24} />
                                {gift.gift_title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <p className="flex items-center text-sm text-gray-600">
                                    <User className="mr-2" size={16} />
                                    Gift from: <span className="font-medium ml-1">{gift.box_model.owner}</span>
                                </p>
                                <p className="flex items-center text-sm text-gray-600">
                                    <Calendar className="mr-2" size={16} />
                                    Open date: <span className="font-medium ml-1">{format(parseISO(gift.open_date), 'MMMM d, yyyy')}</span>
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            const shouldOpen = differenceInDays(parseISO(gift.open_date), new Date()) <= 0;
                                            if (shouldOpen) {
                                                setOpenGift(gift);
                                                setOpenDialog(true);
                                                handleGiftOpen(gift);
                                            } else {
                                                toast.info('This gift box is not ready to be opened yet.');
                                            }
                                        }}
                                    >
                                        Open Gift
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-3xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-2xl font-bold text-center mb-4">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                                                Your Special Gift
                                            </span>
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <Tabs defaultValue="details" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="details">Gift Details</TabsTrigger>
                                            <TabsTrigger value="info">Sender Info</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="details" className="mt-4">
                                            <div className="text-center mb-6">
                                                <Package className="w-16 h-16 mx-auto text-purple-500" />
                                                <h3 className="text-xl font-semibold mt-2">{openGift?.box_model.title}</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center">
                                                    <Calendar className="mr-2 text-purple-500" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Open Date</p>
                                                        <p className="font-medium">{format(parseISO(openGift?.box_model.open_date ?? new Date().toISOString()), 'MMMM d, yyyy')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="mr-2 text-purple-500" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Created</p>
                                                        <p className="font-medium">{format(parseISO(openGift?.box_model.created_at ?? new Date().toISOString()), 'MMMM d, yyyy')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="info" className="mt-4">
                                            <div className="flex items-center justify-center mb-6">
                                                <Avatar className="w-20 h-20">
                                                    <AvatarImage src="/placeholder-avatar.png" alt="Sender" />
                                                    <AvatarFallback>{openGift?.box_model.owner.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <User className="mr-2 text-purple-500" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500">From</p>
                                                        <p className="font-medium">{openGift?.box_model.owner}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Mail className="mr-2 text-purple-500" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="font-medium">{openGift?.box_model.receiver_email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="mr-2 text-purple-500" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Phone</p>
                                                        <p className="font-medium">{openGift?.box_model.receiver_phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-gray-500 flex items-center justify-center">
                                            <Heart className="mr-2 text-pink-500" size={16} />
                                            Sent with love to {openGift?.box_model.receiver_name}
                                        </p>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ViewGifts;