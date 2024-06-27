'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import EditGiftboxForm from '@/components/forms/EditGiftboxForm';
import EditMiniboxForm from '@/components/forms/EditMiniboxForm';
import requireAuth from '@/lib/require-auth';
import useGetGiftbox from '@/lib/hooks/useGetGiftbox';
import { useParams } from 'next/navigation';

export interface GiftBoxValues {
    title: string;
    receiverName: string;
    receiverPhone: string;
    openDate: string;
    open_after_a_day: boolean;
}

const SetupBox = () => {
    const steps = 2;
    const label = ['Edit receiver details', 'Edit mini boxes details']
    const [currentStep, setCurrentStep] = useState(0);
    const width = `${(100 / (steps - 1)) * (currentStep)}%`;

    const boxId = useParams().box_id;

    const { data: giftBox, } = useGetGiftbox(boxId);
    console.log(giftBox);

    const [data, setData] = useState<GiftBoxValues>({
        title: '',
        receiverName: '',
        receiverPhone: '',
        openDate: '',
        open_after_a_day: false
    });

    const handleNextStep = (newData: GiftBoxValues, final: boolean) => {
        setData(prev => ({ ...prev, ...newData }));

        if (final) {
            console.log(newData);
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
            data={data} />
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