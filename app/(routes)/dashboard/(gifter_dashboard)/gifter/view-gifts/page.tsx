'use client';

import useGetGiftsReceived from "@/lib/hooks/useGetGiftsReceived";
import { Gift } from "lucide-react";
import { useSearchParams } from "next/navigation";

const ViewGifts = () => {
    const { data: giftsReceived } = useGetGiftsReceived();

    return (
        <div className="container flex flex-col py-10">
            <p className="text-2xl font-semibold">Gift boxes received</p>
            <div className="grid grid-cols-4 gap-x-4">
                {
                    giftsReceived?.map(gift => (
                        <div className="flex flex-col space-y-2 p-2 items-center justify-center text-center rounded-lg border">
                            <Gift size={64} />

                            <p className="font-semibold">{gift.title}</p>
                            <p className="text-gray-400 text-sm font-normal">
                                Gift owned by: <span className="text-black font-medium">{gift.owner}</span>
                            </p>
                            <p className="text-gray-400 text-sm font-normal">
                                Open date: <span className="text-black font-medium">{gift.open_date}</span>
                            </p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ViewGifts;