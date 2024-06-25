'use client';

import { Form, FieldArray, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';

interface MiniGiftValues {
    id: string;
    gift_title: string;
    gift_description: string;
    gift_content_type: string;
    reaction: string;
    opened: boolean;
    open_date: string;
    user: number;
    box_model: number;
    gift_campaign: number;
}

const validationSchema = Yup.object().shape({
    id: Yup.string().required('Enter the ID'),
    gift_title: Yup.string().required('Enter the gift title'),
    gift_description: Yup.string().required('Enter the gift description'),
    gift_content_type: Yup.string().required('Enter the gift content type'),
    reaction: Yup.string().required('Enter the reaction'),
    opened: Yup.boolean().required('Specify if opened'),
    open_date: Yup.date().required('Enter the open date'),
    user: Yup.number().required('Enter the user ID'),
    box_model: Yup.number().required('Enter the box model ID'),
    gift_campaign: Yup.number().required('Enter the gift campaign ID'),
});

const SetUpMiniGiftsForm = () => {
    const initialValues: { gifts: MiniGiftValues[] } = {
        gifts: [{
            id: '',
            gift_title: '',
            gift_description: '',
            gift_content_type: '',
            reaction: '',
            opened: false,
            open_date: '',
            user: 0,
            box_model: 0,
            gift_campaign: 0,
        }]
    };

    const handleSubmit = (values: { gifts: MiniGiftValues[] }, actions: FormikHelpers<{ gifts: MiniGiftValues[] }>) => {
        console.log('Form data', values);
        actions.setSubmitting(false);
        actions.resetForm();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
                gifts: Yup.array().of(validationSchema)
            })}
            onSubmit={handleSubmit}
        >
            {(formik) => (
                <Form className='flex flex-col space-y-5'>
                    <FieldArray name='gifts'>
                        {({ push, remove, form }) => (
                            <>
                                {form.values.gifts.map((gift, index) => (
                                    <div key={index} className='space-y-3'>
                                        <FormikControl
                                            type='text'
                                            name={`gifts[${index}].id`}
                                            label='ID'
                                            placeholder='ID'
                                            control='input'
                                        />
                                        <FormikControl
                                            type='text'
                                            name={`gifts[${index}].gift_title`}
                                            label='Gift Title'
                                            placeholder='Gift title'
                                            control='input'
                                        />
                                        <FormikControl
                                            type='text'
                                            name={`gifts[${index}].gift_description`}
                                            label='Gift Description'
                                            placeholder='Gift description'
                                            control='input'
                                        />
                                        <FormikControl
                                            type='text'
                                            name={`gifts[${index}].gift_content_type`}
                                            label='Gift Content Type'
                                            placeholder='Gift content type'
                                            control='input'
                                        />
                                        <FormikControl
                                            type='text'
                                            name={`gifts[${index}].reaction`}
                                            label='Reaction'
                                            placeholder='Reaction'
                                            control='input'
                                        />
                                        <FormikControl
                                            type='checkbox'
                                            name={`gifts[${index}].opened`}
                                            label='Opened'
                                            control='checkbox'
                                        />
                                        <FormikControl
                                            type='datetime-local'
                                            name={`gifts[${index}].open_date`}
                                            label='Open Date'
                                            control='input'
                                        />
                                        <FormikControl
                                            type='number'
                                            name={`gifts[${index}].user`}
                                            label='User ID'
                                            control='input'
                                        />
                                        <FormikControl
                                            type='number'
                                            name={`gifts[${index}].box_model`}
                                            label='Box Model ID'
                                            control='input'
                                        />
                                        <FormikControl
                                            type='number'
                                            name={`gifts[${index}].gift_campaign`}
                                            label='Gift Campaign ID'
                                            control='input'
                                        />
                                        <button type='button' onClick={() => remove(index)} className='text-red-500'>Remove Gift</button>
                                    </div>
                                ))}
                                <button type='button' onClick={() => push({
                                    id: '',
                                    gift_title: '',
                                    gift_description: '',
                                    gift_content_type: '',
                                    reaction: '',
                                    opened: false,
                                    open_date: '',
                                    user: 0,
                                    box_model: 0,
                                    gift_campaign: 0,
                                })} className='px-4 py-2 bg-green-500 text-white rounded'>Add Gift</button>
                            </>
                        )}
                    </FieldArray>
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

export default SetUpMiniGiftsForm;
