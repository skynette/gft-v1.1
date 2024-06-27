'use client';

import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import EditGiftboxForm from '@/components/forms/EditGiftboxForm';
import EditMiniboxForm from '@/components/forms/EditMiniboxForm';
import requireAuth from '@/lib/require-auth';
import useGetGiftbox from '@/lib/hooks/useGetGiftbox';
import { useParams, useRouter } from 'next/navigation';
import useGetMinibox from '@/lib/hooks/useGetMinibox';
import useSetMiniBox from '@/lib/hooks/useSetMinibox';
import { toast } from 'sonner';

export interface Minibox {
    id: string;
    title: string;
    desc: string;
    openDate: string;
}

export interface GiftBoxValues {
    title: string;
    receiverName: string;
    receiverPhone: string;
    openDate: string;
    open_after_a_day: boolean;
    miniboxes: Minibox[];
}

const SetupBox = () => {
    const boxId = useParams().box_id;
    const router = useRouter();

    const steps = 2;
    const label = ['Edit receiver details', 'Edit mini boxes details']
    const [currentStep, setCurrentStep] = useState(0);
    const width = `${(100 / (steps - 1)) * (currentStep)}%`;


    const { data: giftBox } = useGetGiftbox(boxId);
    const { data: miniBox, } = useGetMinibox(boxId);
    const { mutate, isPending } = useSetMiniBox({
        boxId, onSuccess() {
            toast.success('Gifts updated successfully.');
            router.replace('/dashboard/gifter');
        },
    });

    const [data, setData] = useState<GiftBoxValues>({
        title: '',
        receiverName: '',
        receiverPhone: '',
        openDate: '',
        open_after_a_day: false,
        miniboxes: [],
    });

    useEffect(() => {
        setData(prev => ({
            ...prev,
            title: giftBox?.title ?? '',
            receiverName: giftBox?.receiver_name ?? '',
            receiverPhone: giftBox?.receiver_phone ?? '',
            openDate: giftBox?.open_date ?? '',
            open_after_a_day: giftBox?.open_after_a_day ?? false,
        }));

    }, [giftBox]);

    useEffect(() => {
        const miniboxes = miniBox?.map(box => ({ id: box.id, title: box.gift_title, desc: box.gift_description, openDate: box.open_date })) ?? [];
        setData(prev => ({ ...prev, miniboxes }));
    }, [miniBox])

    const handleNextStep = (newData: GiftBoxValues, final: boolean) => {
        setData(prev => ({ ...prev, ...newData }));

        if (final) {
            mutate(newData.miniboxes);
            return;
        }

        setCurrentStep(prev => ++prev);
    }

    const handlePrevStep = (newData: GiftBoxValues) => {
        setData(prev => ({ ...prev, ...newData }));
        setCurrentStep(prev => --prev);
    }

    const forms = [
        <EditGiftboxForm key={nanoid()} onNext={handleNextStep} data={data} />,
        <EditMiniboxForm key={nanoid()} onPrev={handlePrevStep} onNext={handleNextStep}
            data={data} isPending={isPending} />
    ];

    return (
        <div className="container flex flex-col justify-center items-center py-10">
            <h1 className='font-semibold text-2xl capitalize'>GFT Setup box</h1>
            <div className='container relative w-full max-w-xl'>
                <style>
                    {`
                        #step-container::after {
                            width: ${width};
                        }
                    `}
                </style>

                <div id='step-container' className={`flex justify-between relative my-2 before:absolute before:content-[""] before:w-full before:bg-[#A1AEBE] before:h-1 before:top-[50%] before:left-0 before:-translate-y-[50%]
                    after:absolute after:content-[""] after:bg-primary after:h-1 after:w-[calc((100%/${steps - 1})*${currentStep - 1})] after:top-[50%] after:-translate-y-[50%] after:left-0`}
                >
                    {
                        Array.from({ length: steps }).map((item, index) => {
                            return (
                                <div key={index} className='relative z-10'>
                                    <div className={`${index <= currentStep ? 'border-primary' : 'border-[#A1AEBE]'} border-2 bg-white p-2 w-[32px] h-[32px] flex justify-center items-center rounded-full`}>
                                        <p className={`${index <= currentStep ? 'text-primary' : 'text-[#A1AEBE]'} text-xs`}>{`0${index + 1}`}</p>
                                        <div className='absolute top-[50px] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
                                            <p className={`${index <= currentStep ? 'text-primary' : 'text-[#A1AEBE]'} font-bold text-xs text-center whitespace-nowrap`}>{label[index]}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {forms[currentStep]}
        </div>
    )
}

export default requireAuth(SetupBox);