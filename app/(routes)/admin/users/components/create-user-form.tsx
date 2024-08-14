'use client';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import FormikControl from '@/components/form-controls/FormikControl';
import { Button } from '@/components/ui/button';
import { adminCreateUsers, adminUpdateUsers } from '@/network-api/admin/endpoint';
import { get, set } from 'lodash';
import { useState } from 'react';
import ImageUpload from '@/components/form-controls/ImageUpload';

const validationSchema = Yup.object().shape({
    last_login: Yup.string().optional(),
    is_superuser: Yup.boolean().optional(),
    is_staff: Yup.boolean().optional(),
    is_active: Yup.boolean().optional(),
    date_joined: Yup.string().optional(),
    created_at: Yup.string().optional(),
    updated_at: Yup.string().optional(),
    first_name: Yup.string().optional(),
    last_name: Yup.string().optional(),
    username: Yup.string().optional(),
    email: Yup.string().email('Invalid email format').optional(),
    mobile: Yup.string().optional(),
    contact_preference: Yup.string().optional(),
    image: Yup.string().url('Invalid URL format').optional(),
    provider: Yup.string().optional(),
    user_type: Yup.string().optional(),
    groups: Yup.array().of(Yup.object()).optional(),
    user_permissions: Yup.array().of(Yup.object()).optional(),
});

type AdminCreateUserFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateUserForm = ({ initialValue, onClose }: { initialValue?: AdminUserRequest, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // options
    const contactPreferenceOptions = [
        {
            option: "email",
            value: "email"
        },
        {
            option: "phone",
            value: "phone"
        },
    ]

    const providerOptions = [
        {
            option: "credentials",
            value: "credentials"
        },
        {
            option: "google",
            value: "google"
        },
        {
            option: "apple",
            value: "apple"
        },
    ]

    const userTypeOptions = [
        {
            option: "super_admin",
            value: "super_admin"
        },
        {
            option: "user",
            value: "user"
        },
        {
            option: "company",
            value: "company"
        }
    ]

    // mutate function for creating the user
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminUserRequest>({
        mutationFn: (req: AdminUserRequest) => adminCreateUsers(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('User created successfully');
            console.log({ data, variables, context });
            onClose();
            client.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError(error) {
            toast.error('Error creating user');
            console.error(error);
        },
    });

    // mutate function for updating the user
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, any>({
        mutationFn: (req: AdminUserRequest) => adminUpdateUsers(initialValue?.pkid?.toString() ?? '', session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('User updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError(error) {
            toast.error('Error updating user');
            console.error(error);
        },
    });

    const initialValues: AdminCreateUserFormSchema = {
        last_login: initialValue?.last_login ?? '',
        is_superuser: initialValue?.is_superuser ?? false,
        is_staff: initialValue?.is_staff ?? false,
        is_active: initialValue?.is_active ?? false,
        date_joined: initialValue?.date_joined ?? '',
        created_at: initialValue?.created_at ?? '',
        updated_at: initialValue?.updated_at ?? '',
        first_name: initialValue?.first_name ?? '',
        last_name: initialValue?.last_name ?? '',
        username: initialValue?.username ?? '',
        email: initialValue?.email ?? '',
        mobile: initialValue?.mobile ?? '',
        contact_preference: initialValue?.contact_preference ?? '',
        image: initialValue?.image ?? '',
        provider: initialValue?.provider ?? '',
        user_type: initialValue?.user_type ?? '',
        // groups:initialValue?.groups ?? [],
        // user_permissions:initialValue?.user_permissions ?? [],
    };

    const handleSubmit = (values: AdminCreateUserFormSchema) => {
        console.log("handle submit called");
        const data = {};
        Object.entries(initialValues).forEach(([key, oldVal]) => {
            const newVal = get(values, key);
            if (newVal !== oldVal) {
                set(data, key, newVal);
            }
        });

        if (query === 'update') {
            console.log("updated data", data);
            mutateUpdate(data);
        } else {
            const payload: AdminUserRequest = {
                last_login: values.last_login,
                is_superuser: values.is_superuser,
                is_staff: values.is_staff,
                is_active: values.is_active,
                date_joined: values.date_joined,
                created_at: values.created_at,
                updated_at: values.updated_at,
                first_name: values.first_name,
                last_name: values.last_name,
                username: values.username,
                email: values.email,
                mobile: values.mobile,
                contact_preference: values.contact_preference,
                image: values.image,
                provider: values.provider,
                user_type: values.user_type
            };
            mutateCreate(payload);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ dirty, isValid, values, setFieldValue }) => (
                <Form className='w-full flex flex-col space-y-5 mt-[5%]'>
                    <FormikControl
                        type='text'
                        name='first_name'
                        label='First Name'
                        placeholder='First Name'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='last_name'
                        label='Last Name'
                        placeholder='Last Name'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='username'
                        label='Username'
                        placeholder='Username'
                        control='input'
                    />

                    <FormikControl
                        type='email'
                        name='email'
                        label='Email'
                        placeholder='Email'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='mobile'
                        label='Mobile'
                        placeholder='Mobile'
                        control='phone-input'
                    />

                    <FormikControl
                        type='text'
                        name='contact_preference'
                        label='Contact Preference'
                        placeholder='Contact Preference'
                        control='select'
                        disabled={false}
                        defaultValue={initialValue?.contact_preference ?? "email"}
                        options={contactPreferenceOptions ?? []}
                        handleChange={(value) => setFieldValue('contact_preference', value)}
                    />

                    <FormikControl
                        type='url'
                        name='image'
                        label='Image URL'
                        placeholder='Image URL'
                        control='input'
                    />

                    {/* <div className='flex flex-col'>
                        <p className='text-sm'>Upload image</p>
                        <ImageUpload
                            value={values.image ? [values.image] : []}
                            disabled={isCreatePending || isUpdatePending}
                            onChange={(url) => setFieldValue('image', url)}
                            onRemove={() => setFieldValue('image', '')}
                        />
                    </div> */}

                    <FormikControl
                        type='text'
                        name='provider'
                        label='Provider'
                        placeholder='Provider'
                        control='select'
                        disabled={false}
                        defaultValue={initialValue?.provider ?? "credentials"}
                        options={providerOptions ?? []}
                        handleChange={(value) => setFieldValue('provider', value)}
                    />

                    <FormikControl
                        type='text'
                        name='user_type'
                        label='User Type'
                        placeholder='User Type'
                        control='select'
                        disabled={false}
                        defaultValue={initialValue?.user_type ?? "user"}
                        options={userTypeOptions ?? []}
                        handleChange={(value) => setFieldValue('user_type', value)}
                    />

                    <FormikControl
                        type='date'
                        name='last_login'
                        label='Last Login'
                        control='date-picker'
                    />

                    <FormikControl
                        type='checkbox'
                        name='is_superuser'
                        label='Is Superuser'
                        control='checkbox'
                    />

                    <FormikControl
                        type='checkbox'
                        name='is_staff'
                        label='Is Staff'
                        control='checkbox'
                    />

                    <FormikControl
                        type='checkbox'
                        name='is_active'
                        label='Is Active'
                        control='checkbox'
                    />

                    <FormikControl
                        type='date'
                        name='date_joined'
                        label='Date Joined'
                        control='date-picker'
                    />

                    <FormikControl
                        type='date'
                        name='created_at'
                        label='Created At'
                        control='date-picker'
                    />

                    <FormikControl
                        type='date'
                        name='updated_at'
                        label='Updated At'
                        control='date-picker'
                    />

                    <Button
                        type='submit'
                        disabled={isCreatePending || isUpdatePending}
                        isLoading={isCreatePending || isUpdatePending}
                        className={`inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50`}
                    >
                        Continue <ArrowRight size={18} className='text-white ml-2' />
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default AdminCreateUserForm;
