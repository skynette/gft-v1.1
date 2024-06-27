'use client';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import { Button } from '../ui/button';
import { isValidPhoneNumber } from 'react-phone-number-input'
import { ArrowRight } from 'lucide-react';
import { GiftBoxValues } from '@/(routes)/dashboard/(gifter_dashboard)/gifter/gift-boxes/[box_id]/setup/page';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Enter the title').min(10, 'Title must be at least 10 characters'),
    receiverName: Yup.string().required('Enter the receiver name'),
    receiverPhone: Yup.string().required('Enter the receiver phone').test(
        'is valid phone', 'Invalid phone number', (value) => isValidPhoneNumber(value)
    ),
    openDate: Yup.date().required('Enter the open date'),
    open_after_a_day: Yup.boolean().required('Specify if it opens after a day'),
});

const EditGiftboxForm = ({ onNext, data }: {
    onNext: (data: GiftBoxValues, final: boolean) => void, data: GiftBoxValues
}) => {

    // const initialValues: GiftBoxValues = {
    //     title: '',
    //     receiverName: '',
    //     receiverEmail: '',
    //     receiverPhone: '',
    //     openDate: '',
    //     open_after_a_day: true,
    // };

    const handleSubmit = (values: GiftBoxValues) => {
        console.log('submit')
        onNext(values, false);
    };

    return (
        <Formik
            initialValues={data}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form className='w-full bg-gray-50 max-w-xl flex flex-col space-y-5 shadow-md rounded-lg p-8 mt-[5%]'>
                <FormikControl
                    type='text'
                    name='title'
                    label='Title'
                    placeholder='Title of the gift box'
                    control='input'
                />

                <FormikControl
                    type='text'
                    name='receiverName'
                    label='Receiver name'
                    placeholder='Town Hall'
                    control='input'
                />

                <FormikControl
                    type='text'
                    name='receiverPhone'
                    label='Receiver phone'
                    placeholder=''
                    control='phone-input'
                />

                <FormikControl
                    type='text'
                    name='openDate'
                    label='Open date'
                    placeholder=''
                    control='date-picker'
                />

                <FormikControl
                    type='text'
                    name='open_after_a_day'
                    label='Open after 24hrs'
                    placeholder=''
                    control='checkbox'
                />

                <Button
                    type='submit'
                    className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
                >
                    Continue <ArrowRight size={18} className='text-white ml-2' />
                </Button>
            </Form>
        </Formik>
    );
};

export default EditGiftboxForm;