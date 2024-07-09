'use client'

import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import FormikControl from '@/components/form-controls/FormikControl';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { isValidPhoneNumber } from 'libphonenumber-js';
import useUpdateUser from '@/lib/hooks/useUpdateUser';
import { useSession } from 'next-auth/react';
import useGetProfile from '@/lib/hooks/useGetProfile';
import { useQueryClient } from '@tanstack/react-query';
import { SyncLoader } from 'react-spinners';

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

export default function ProfileForm() {
    const queryClient = useQueryClient();
    const { data, update } = useSession();
    const { data: profile, isPending: profileLoading } = useGetProfile();

    const { mutate, isPending } = useUpdateUser({
        onSuccess(variables) {
            toast.success('Profile updated');
            update({
                ...data,
                user: {
                    ...data?.user,
                    firstName: variables?.first_name,
                    lastName: variables?.last_name,
                    name: variables.first_name + ' ' + variables.last_name,
                    mobile: variables.mobile,
                    contactPreference: variables.contact_preference,
                }
            }).then(() => queryClient.invalidateQueries({ queryKey: ['profile'] }));
        },
    });

    if (profileLoading) {
        return <SyncLoader size={15} color='#3b82f6'/>;
    }

    const defaultValues: ProfileFormValues = {
        fullname: (profile?.first_name ?? '') + ' ' + (profile?.last_name ?? ''),
        username: profile?.username ?? '',
        email: data?.user.email ?? '',
        phone: profile?.mobile ?? '',
        contactPreference: profile?.contact_preference ?? 'phone',
    };

    const onSubmit = async (values: ProfileFormValues) => {
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
            enableReinitialize={true}
        >
            {
                ({ values }) => (
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
                            disabled={true}
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
                            defaultValue={values.contactPreference}
                            options={[{ option: 'Phone', value: 'phone' }, { option: 'Email', value: 'email' }]}
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
                )
            }
        </Formik>
    );
}
