'use client';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { ArrowRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import FormikControl from '@/components/form-controls/FormikControl';
import { Button } from '@/components/ui/button';
import { adminCreateBox, adminUpdateBox } from '@/network-api/admin/endpoint';
import { useGetAdminCampaigns } from '@/lib/hooks/admin-hooks';
import { get, set } from 'lodash';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Must have a title'),
    receiverName: Yup.string().optional(),
    receiverEmail: Yup.string().optional().email(),
    receiverPhone: Yup.string().optional().test(
        'is valid phone', 'Invalid phone number', (value) => isValidPhoneNumber(value ?? '')
    ),
    days_of_gifting: Yup.number().required('Days of gifting cannot be blank'),
    openDate: Yup.date().optional(),
    is_setup: Yup.boolean().optional(),
    is_company_setup: Yup.boolean().optional(),
    open_after_a_day: Yup.boolean().optional(),
    user: Yup.string().required("User cannot be blank"),
    box_campaign: Yup.number().required('Select box campaign'),
});

type AdminCreateFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateBoxForm = ({ initialValue, onClose }: { initialValue?: AdminBoxResponse, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // fetch the campaigns
    const { data } = useGetAdminCampaigns();
    const boxCampaigns = data?.map(campaign => ({ option: campaign.name, value: campaign.pkid.toLocaleString() }));

    // mutate function for creating the box
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminBoxRequest>({
        mutationFn: (req: AdminBoxRequest) => adminCreateBox(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Box created successfully');
            console.log({ data, variables, context })
            onClose();
            client.invalidateQueries({ queryKey: ['admin-box'] });
        },
        onError(error) {
            toast.error('Error updating box');
            console.error(error);
        },
    });

    // mutate function for updating the box
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, any>({
        mutationFn: (req: AdminBoxRequest) => adminUpdateBox(initialValue?.id ?? '', session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Box updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-box'] });
        },
        onError(error) {
            toast.error('Error updating box');
            console.error(error);
        },
    });

    const initialValues: AdminCreateFormSchema = {
        title: initialValue?.title ?? '',
        receiverName: initialValue?.receiver_name ?? '',
        receiverEmail: initialValue?.receiver_email ?? '',
        receiverPhone: initialValue?.receiver_phone ?? '',
        days_of_gifting: initialValue?.days_of_gifting ?? 0,
        openDate: initialValue?.open_date ? new Date(initialValue.open_date) : new Date(),
        is_setup: initialValue?.is_setup ?? false,
        is_company_setup: initialValue?.is_company_setup ?? false,
        open_after_a_day: initialValue?.open_after_a_day ?? false,
        user: initialValue?.user?.id ?? '',
        box_campaign: initialValue?.box_campaign ?? 1,
    };

    const handleSubmit = (values: AdminCreateFormSchema) => {
        console.log("handle submit called")
        const data = {};
        Object.entries(initialValues).forEach(([key, oldVal]) => {
            const newVal = get(values, key);
            if (newVal !== oldVal) {
                set(data, key, newVal);
            }
        });
    
        if (query === 'update') {
            console.log("updated data", data)
            mutateUpdate(data);
        } else {
            const payload: AdminBoxRequest = {
                title: values.title ?? '',
                receiver_name: values.receiverName ?? '',
                receiver_email: values.receiverEmail ?? '',
                receiver_phone: values.receiverPhone ?? '',
                days_of_gifting: values.days_of_gifting ?? 0,
                open_date: values.openDate?.toISOString() ?? new Date().toISOString(),
                is_setup: values.is_setup ?? false,
                is_company_setup: values.is_company_setup ?? false,
                open_after_a_day: values.open_after_a_day ?? false,
                user: values.user ?? '',
                box_campaign: values.box_campaign ?? 1,
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
            {({ dirty, isValid, setFieldValue }) => (
                <Form className='w-full flex flex-col space-y-5 mt-[5%]'>
                    <FormikControl
                        type='text'
                        name='title'
                        label='Title'
                        placeholder='Title of the gift box'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='user'
                        label='User Id'
                        placeholder='id'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='receiverEmail'
                        label='Receiver email'
                        placeholder='user@mail.com (optional)'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='receiverName'
                        label='Receiver name'
                        placeholder='Town Hall (optional)'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='receiverPhone'
                        label='Receiver phone'
                        placeholder='Receiver phone (optional)'
                        control='phone-input'
                    />

                    <FormikControl
                        type='number'
                        name='days_of_gifting'
                        label='Days of Gifting'
                        placeholder='Number of days for gifting'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='openDate'
                        label='Open date'
                        placeholder='Select open date'
                        control='date-picker'
                    />

                    <FormikControl
                        type='checkbox'
                        name='is_setup'
                        label='Is setup'
                        placeholder=''
                        control='checkbox'
                    />

                    <FormikControl
                        type='checkbox'
                        name='is_company_setup'
                        label='Is company setup'
                        placeholder=''
                        control='checkbox'
                    />

                    <FormikControl
                        type='checkbox'
                        name='open_after_a_day'
                        label='Open after 24hrs'
                        placeholder=''
                        control='checkbox'
                    />

                    <FormikControl
                        type='select'
                        name='box_campaign'
                        label='Box campaign'
                        placeholder='Select box campaign'
                        control='select'
                        options={boxCampaigns ?? []}
                        handleChange={(value) => setFieldValue('box_campaign', Number(value))}
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

export default AdminCreateBoxForm;
