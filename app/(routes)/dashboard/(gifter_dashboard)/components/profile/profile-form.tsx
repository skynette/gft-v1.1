'use client'

import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import FormikControl from '@/components/form-controls/FormikControl';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { isValidPhoneNumber } from 'libphonenumber-js';
import useUpdateUser from '@/lib/hooks/useUpdateUser';

const profileFormSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required').trim()
        .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)+$/, 'Invalid full name format. Please enter first name and last name.'),
    username: Yup.string()
        .min(2, 'Username must be at least 2 characters.')
        .max(30, 'Username must not be longer than 30 characters.')
        .required('Username is required'),
    email: Yup.string().required('Email is required').email(),
    phone: Yup.string().required('Phone is required').test(
        'is valid phone', 'Invalid phone number', (value) => isValidPhoneNumber(value)
    ),
    contactPreference: Yup.string().optional(),
});

type ProfileFormValues = Yup.InferType<typeof profileFormSchema>;

const defaultValues: ProfileFormValues = {
    fullname: '',
    username: '',
    email: '',
    phone: '',
    contactPreference: 'phone',
};

export default function ProfileForm() {
    const { mutate, isPending } = useUpdateUser({onSuccess() {
        toast.success('Profile updated');
    },});

    const onSubmit = (values: ProfileFormValues, actions: FormikHelpers<ProfileFormValues>) => {
        toast.success('You submitted the following values:',)
        console.log(values)
        mutate({
            first_name: values.fullname.split(' ')[0],
            last_name: values.fullname.split(' ')[1],
            mobile: values.phone,
            contact_preference: values.contactPreference,
            username: values.username,
            image: '',
        })
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
                    name='fullname'
                    label='Full name'
                    placeholder='Town Hall'
                    control='input'
                />

                <FormikControl
                    type='text'
                    name='username'
                    label='Username'
                    placeholder='john_doe'
                    control='input'
                />

                <FormikControl
                    type='email'
                    name='email'
                    label='Email'
                    placeholder='user@mail.com'
                    control='input'
                />

                <FormikControl
                    type='text'
                    name='phone'
                    label='Phone'
                    placeholder='phone number'
                    control='phone-input'
                />

                <FormikControl
                    type='text'
                    name='contactPreference'
                    label='Contact preference'
                    placeholder='Select contact preference'
                    options={[{option: 'Mobile', value: 'mobile'}, {option: 'Email', value: 'email'}]}
                    control='select'
                />

                <Button
                    type='submit'
                    className='w-fit'
                    isLoading={isPending}
                    disabled={isPending}
                >
                    Update profile
                </Button>
            </Form>
        </Formik>
    );

}
