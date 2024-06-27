'use client';

import { Form, Formik } from "formik";
import * as Yup from 'yup';
import FormikControl from "../form-controls/FormikControl";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { GiftBoxValues } from "@/(routes)/dashboard/(gifter_dashboard)/gifter/gift-boxes/[box_id]/setup/page";

interface MiniGiftBox {
    title: string;
    desc: string;
    openDate: string;
}

const validationSchema = Yup.object({
    miniboxes: Yup.array().of(Yup.object({
        title: Yup.string().required('Enter the title').min(5, 'Title must be at least 10 characters'),
        desc: Yup.string().required('Enter the title').min(10, 'Description must be at least 10 characters'),
        openDate: Yup.date().required('Enter the open date'),
    }))
});

const EditMiniboxForm = ({ onPrev, onNext, data }: {
    onPrev: (data: GiftBoxValues) => void,
    onNext: (data: GiftBoxValues, final: boolean) => void,
    data: GiftBoxValues
}) => {

    const handleSubmit = (data: GiftBoxValues) => { onNext(data, true) }

    const initialValues: MiniGiftBox = {
        title: '',
        desc: '',
        openDate: '',
    }

    return (
        <Formik
            initialValues={data}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {
                ({ values }) => (
                    <Form className='w-full bg-gray-50 max-w-xl flex flex-col space-y-5 shadow-md rounded-lg p-8 mt-[5%]'>
                        {
                            Array.from({ length: 2 }).map((_, index) => (
                                <div className="flex flex-col space-y-3 my-2">
                                    <p className="font-medium text-xl">Enter gift for day <span className="text-blue-500 font-bold">{index}</span></p>
                                    <FormikControl
                                        type='text'
                                        name='title'
                                        label='Title'
                                        placeholder='Title of the gift box'
                                        control='input'
                                    />

                                    <FormikControl
                                        type='text'
                                        name='desc'
                                        label='Description'
                                        placeholder='Description of gift box'
                                        control='textarea'
                                    />

                                    <FormikControl
                                        type='text'
                                        name='openDate'
                                        label='Open date'
                                        placeholder=''
                                        control='date-picker'
                                    />
                                </div>
                            ))
                        }
                        <div className="flex space-x-2">
                            <Button variant='outline' className="inline-flex items-center"
                                onClick={() => onPrev(values)}><ArrowLeft size={18} className="mr-2" /> Back</Button>
                            <Button type='submit' >Submit</Button>
                        </div>
                    </Form>
                )
            }
        </Formik>

    )

}

export default EditMiniboxForm;