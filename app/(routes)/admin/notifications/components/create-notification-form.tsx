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
import { adminCreateNotiication, adminUpdateNotification } from '@/network-api/admin/endpoint';
import { useGetAdminBoxes, useGetAdminGifts, useGetAdminUsers } from '@/lib/hooks/admin-hooks';
import { get, set } from 'lodash';

interface AdminNotificationsRequest {
    id?: number;
    message?: string;
    read?: boolean;
    timestamp?: string;
    created_at?: string;
    updated_at?: string;
    user?: number;
    box?: number;
    gift?: number;
}

const validationSchema = Yup.object().shape({
    message: Yup.string().required('Message is required'),
    read: Yup.boolean(),
    timestamp: Yup.string().required('Timestamp is required'),
    created_at: Yup.string(),
    updated_at: Yup.string(),
    user: Yup.number().required('User is required'),
    box: Yup.number().required('Box is required'),
    gift: Yup.number().required('Gift is required'),
});

type AdminCreateFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateNotificationForm = ({ initialValue, onClose }: { initialValue?: AdminNotificationsRequest, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // fetch the box models
    const { data: boxes } = useGetAdminBoxes();
    const boxModels = boxes?.map(box => ({ option: box.title, value: box.pkid.toLocaleString() }));

    // fetch the users
    const { data: users } = useGetAdminUsers();
    const userOptions = users?.map(user => ({ option: user.email, value: user.pkid.toString() }));

    // fetch the gifts
    const { data: gifts } = useGetAdminGifts()
    const giftOptions = gifts?.map(gift => ({ option: gift.gift_title, value: gift.pkid.toString() }))

    // mutate function for creating the notification
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminNotificationsRequest>({
        mutationFn: (req: AdminNotificationsRequest) => adminCreateNotiication(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Notification created successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-notifications'] });
        },
        onError(error) {
            toast.error('Error creating notification');
            console.error(error);
        },
    });

    // mutate function for updating the notification
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, any>({
        mutationFn: (req: AdminNotificationsRequest) => adminUpdateNotification(initialValue?.id?.toString() ?? '', session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Notification updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-notifications'] });
        },
        onError(error) {
            toast.error('Error updating notification');
            console.error(error);
        },
    });

    const initialValues: AdminCreateFormSchema = {
        message: initialValue?.message ?? '',
        read: initialValue?.read ?? false,
        timestamp: initialValue?.timestamp ?? '',
        created_at: initialValue?.created_at ?? '',
        updated_at: initialValue?.updated_at ?? '',
        user: initialValue?.user ?? 1,
        box: initialValue?.box ?? 1,
        gift: initialValue?.gift ?? 1,
    };

    const handleSubmit = (values: AdminCreateFormSchema) => {
        const data = {};
        Object.entries(initialValues).forEach(([key, oldVal]) => {
            const newVal = get(values, key);
            if (newVal !== oldVal) {
                set(data, key, newVal);
            }
        });

        if (query === 'update') {
            mutateUpdate(data);
        } else {
            mutateCreate(values);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ dirty, isValid, setFieldValue }) => (
                <Form className='w-full flex flex-col space-y-5 mt-[5%]'>
                    <FormikControl
                        type='text'
                        name='message'
                        label='Notification Message'
                        placeholder='Enter the notification message'
                        control='input'
                    />

                    <FormikControl
                        type='checkbox'
                        name='read'
                        label='Read'
                        placeholder='Read status'
                        control='checkbox'
                    />

                    <FormikControl
                        type='date'
                        name='timestamp'
                        label='Timestamp'
                        placeholder='Select timestamp'
                        control='date-picker'
                    />

                    <FormikControl
                        type='date'
                        name='created_at'
                        label='Created At'
                        placeholder='Select creation date'
                        control='date-picker'
                    />

                    <FormikControl
                        type='date'
                        name='updated_at'
                        label='Updated At'
                        placeholder='Select updated date'
                        control='date-picker'
                    />

                    <FormikControl
                        type='select'
                        name='user'
                        label='User'
                        placeholder='Select user'
                        control='select'
                        options={userOptions ?? []}
                        handleChange={(value) => setFieldValue('user', Number(value))}
                    />

                    <FormikControl
                        type='select'
                        name='box'
                        label='Box'
                        placeholder='Select box'
                        control='select'
                        options={boxModels ?? []}
                        handleChange={(value) => setFieldValue('box', Number(value))}
                    />

                    <FormikControl
                        type='number'
                        name='gift'
                        label='Gift'
                        placeholder='Select gift'
                        control='select'
                        options={giftOptions ?? []}
                        handleChange={(value) => setFieldValue('gift', Number(value))}
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

export default AdminCreateNotificationForm;
