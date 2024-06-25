'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';

interface GiftBoxValues {
    title: string;
    receiver_name: string;
    receiver_email: string;
    receiver_phone: string;
    open_date: string;
    is_setup: boolean;
    open_after_a_day: boolean;
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Enter the title'),
    receiver_name: Yup.string().required('Enter the receiver name'),
    receiver_email: Yup.string().email('This email is invalid').required('Enter the receiver email'),
    receiver_phone: Yup.string().required('Enter the receiver phone'),
    open_date: Yup.date().required('Enter the open date'),
    is_setup: Yup.boolean().required('Specify if it is setup'),
    open_after_a_day: Yup.boolean().required('Specify if it opens after a day'),
});

const EditGiftBoxForm = () => {
    const initialValues: GiftBoxValues = {
        title: '',
        receiver_name: '',
        receiver_email: '',
        receiver_phone: '',
        open_date: '',
        is_setup: true,
        open_after_a_day: true,
    };

    const handleSubmit = (values: GiftBoxValues, actions: FormikHelpers<GiftBoxValues>) => {
        console.log('Form data', values);
        actions.setSubmitting(false);
        actions.resetForm();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => (
                <Form className='flex flex-col space-y-5'>
                    <FormikControl
                        type='text'
                        name='title'
                        label='Title'
                        placeholder='Title of the gift box'
                        control='input'
                    />
                    <FormikControl
                        type='text'
                        name='receiver_name'
                        label='Receiver Name'
                        placeholder='Name of the receiver'
                        control='input'
                    />
                    <FormikControl
                        type='email'
                        name='receiver_email'
                        label='Receiver Email'
                        placeholder='Receiver email address'
                        control='input'
                    />
                    <FormikControl
                        type='text'
                        name='receiver_phone'
                        label='Receiver Phone'
                        placeholder='Receiver phone number'
                        control='input'
                    />
                    <FormikControl
                        type='datetime-local'
                        name='open_date'
                        label='Open Date'
                        control='input'
                    />
                    <FormikControl
                        type='checkbox'
                        name='is_setup'
                        label='Is Setup'
                        control='checkbox'
                    />
                    <FormikControl
                        type='checkbox'
                        name='open_after_a_day'
                        label='Open After A Day'
                        control='checkbox'
                    />
                    <button
                        type='submit'
                        className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
                        disabled={formik.isSubmitting}
                    >
                        Submit
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default EditGiftBoxForm;
