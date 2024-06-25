'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';

interface CompanyBoxValues {
    user: number;
    box_campaign: number;
    box_category: number;
    title: string;
    receiver_name: string;
    receiver_email: string;
    receiver_phone: string;
    open_date: string;
    last_opened: string;
    is_setup: boolean;
    is_company_setup: boolean;
    open_after_a_day: boolean;
}

const validationSchema = Yup.object().shape({
    user: Yup.number().required('Enter the user ID'),
    box_campaign: Yup.number().required('Enter the box campaign ID'),
    box_category: Yup.number().required('Enter the box category ID'),
    title: Yup.string().required('Enter the title'),
    receiver_name: Yup.string().required('Enter the receiver name'),
    receiver_email: Yup.string().email('This email is invalid').required('Enter the receiver email'),
    receiver_phone: Yup.string().required('Enter the receiver phone'),
    open_date: Yup.date().required('Enter the open date'),
    last_opened: Yup.date().required('Enter the last opened date'),
    is_setup: Yup.boolean().required('Specify if it is setup'),
    is_company_setup: Yup.boolean().required('Specify if it is company setup'),
    open_after_a_day: Yup.boolean().required('Specify if it opens after a day'),
});

const CompanyCreateBoxForm = () => {
    const initialValues: CompanyBoxValues = {
        user: 0,
        box_campaign: 0,
        box_category: 0,
        title: '',
        receiver_name: '',
        receiver_email: '',
        receiver_phone: '',
        open_date: '',
        last_opened: '',
        is_setup: true,
        is_company_setup: true,
        open_after_a_day: true,
    };

    const handleSubmit = (values: CompanyBoxValues, actions: FormikHelpers<CompanyBoxValues>) => {
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
                        type='number'
                        name='user'
                        label='User ID'
                        control='input'
                    />
                    <FormikControl
                        type='number'
                        name='box_campaign'
                        label='Box Campaign ID'
                        control='input'
                    />
                    <FormikControl
                        type='number'
                        name='box_category'
                        label='Box Category ID'
                        control='input'
                    />
                    <FormikControl
                        type='text'
                        name='title'
                        label='Title'
                        placeholder='Box title'
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
                        type='datetime-local'
                        name='last_opened'
                        label='Last Opened Date'
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
                        name='is_company_setup'
                        label='Is Company Setup'
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

export default CompanyCreateBoxForm;
