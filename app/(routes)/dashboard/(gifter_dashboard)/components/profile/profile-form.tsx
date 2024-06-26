'use client'

import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import FormikControl from '@/components/form-controls/FormikControl';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const profileFormSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, 'Username must be at least 2 characters.')
        .max(30, 'Username must not be longer than 30 characters.')
        .required('Username is required'),
});

type ProfileFormValues = Yup.InferType<typeof profileFormSchema>;

const defaultValues: ProfileFormValues = {
    username: '',
};

export default function ProfileForm() {
    const onSubmit = (values: ProfileFormValues, actions: FormikHelpers<ProfileFormValues>) => {
        toast.success('You submitted the following values:',)
        actions.setSubmitting(false);
    };

    return (
        <Formik
            initialValues={defaultValues}
            validationSchema={profileFormSchema}
            onSubmit={onSubmit}
        >
            <Form className='w-full max-w-xl flex flex-col space-y-5 mt-[5%]'>
                <FormikControl
                    type='text'
                    name='username'
                    label='Username'
                    placeholder='shadcn'
                    control='input'
                />
                <Button
                    type='submit'
                    className='w-fit'
                >
                    Update profile
                </Button>
            </Form>
        </Formik>
    );
    
}
