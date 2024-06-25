'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';

interface CampaignValues {
    company: number;
    name: string;
    company_boxes: number;
    duration: number;
    num_boxes: number;
    header_image: string;
    open_after_a_day: boolean;
}

const validationSchema = Yup.object().shape({
    company: Yup.number().required('Enter the company ID'),
    name: Yup.string().required('Enter the name'),
    company_boxes: Yup.number().required('Enter the company boxes'),
    duration: Yup.number().required('Enter the duration'),
    num_boxes: Yup.number().required('Enter the number of boxes'),
    header_image: Yup.string().required('Enter the header image URL'),
    open_after_a_day: Yup.boolean().required('Specify if it opens after a day'),
});

const CreateCampaignForm = () => {
    const initialValues: CampaignValues = {
        company: 0,
        name: '',
        company_boxes: 0,
        duration: 0,
        num_boxes: 0,
        header_image: '',
        open_after_a_day: true,
    };

    const handleSubmit = (values: CampaignValues, actions: FormikHelpers<CampaignValues>) => {
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
                        name='company'
                        label='Company ID'
                        control='input'
                    />
                    <FormikControl
                        type='text'
                        name='name'
                        label='Name'
                        placeholder='Campaign name'
                        control='input'
                    />
                    <FormikControl
                        type='number'
                        name='company_boxes'
                        label='Company Boxes'
                        control='input'
                    />
                    <FormikControl
                        type='number'
                        name='duration'
                        label='Duration'
                        control='input'
                    />
                    <FormikControl
                        type='number'
                        name='num_boxes'
                        label='Number of Boxes'
                        control='input'
                    />
                    <FormikControl
                        type='text'
                        name='header_image'
                        label='Header Image URL'
                        placeholder='URL of the header image'
                        control='input'
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

export default CreateCampaignForm;
