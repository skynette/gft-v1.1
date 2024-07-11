'use client';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import { Button } from '../ui/button';
import { isValidPhoneNumber } from 'react-phone-number-input'
import { ArrowRight } from 'lucide-react';
import useGetCompanyCategorybox from '@/lib/hooks/useGetCompanyCategorybox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateBoxRequest } from '@/lib/response-type/company_dashboard/CreateBoxRequest';
import { createBox, updateBox } from '@/network-api/dashboard/endpoint';
import { useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { BoxResponse } from '@/lib/response-type/company_dashboard/BoxesRespose';
import { useSearchParams } from 'next/navigation';
import { format, parse } from 'date-fns';

const validationSchema = Yup.object().shape({
    title: Yup.string().optional(),
    receiverName: Yup.string().optional(),
    receiverPhone: Yup.string().optional().test(
        'is valid phone', 'Invalid phone number', (value) => isValidPhoneNumber(value ?? '')
    ),
    receiverEmail: Yup.string().optional().email(),
    boxCategory: Yup.string().required('Select box category'),
    openDate: Yup.date().optional(),
    open_after_a_day: Yup.boolean().optional(),
});

type CreateFormSchema = Yup.InferType<typeof validationSchema>;

const CreateBoxForm = ({ initialValue, onClose }: { initialValue?: BoxResponse, onClose: () => void }) => {
    const session = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const { data } = useGetCompanyCategorybox();
    const client = useQueryClient();
    const boxCategory = data?.map(box => ({ option: box.box_type.name, value: box.box_type.id.toString() }));

    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, CreateBoxRequest>({
        mutationFn: (req: CreateBoxRequest) => createBox(session?.data?.accessToken ?? '', session?.data?.companyAPIKey ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Box created successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['company-box'] })
        },
    });

    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, CreateBoxRequest>({
        mutationFn: (req: CreateBoxRequest) => updateBox(initialValue?.id ?? '', session?.data?.accessToken ?? '', session?.data?.companyAPIKey ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Box updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['company-box'] })
        },
    });

    const initialValues: CreateFormSchema = {
        title: initialValue?.title ?? '',
        receiverEmail: initialValue?.receiver_email ?? '',
        receiverPhone: initialValue?.receiver_phone ?? '',
        receiverName: initialValue?.receiver_name ?? '',
        openDate: parse(initialValue?.open_date ?? '', 'dd-MM-yyyy', new Date()),
        open_after_a_day: initialValue?.open_after_a_day,
        boxCategory: initialValue?.box_campaign.toString() ?? '',
    }

    const handleSubmit = (values: CreateFormSchema) => {
        if (query === 'update') {
            if (!initialValue?.is_setup)
                mutateUpdate({
                    title: values?.title ?? '',
                    receiver_email: values?.receiverEmail ?? '',
                    receiver_name: values?.receiverName ?? '',
                    receiver_phone: values?.receiverPhone ?? '',
                    open_date: parse(values?.openDate?.toISOString() ?? '', 'dd-MM-yyy', new Date()),
                    box_category: +values?.boxCategory ?? 0,
                    is_setup: false,
                    is_company_setup: false,
                    last_opened: new Date(),
                    open_after_a_day: false,
                });
        } else mutateCreate({
            title: values.title ?? '',
            receiver_email: values.receiverEmail ?? '',
            receiver_name: values.receiverName ?? '',
            receiver_phone: values.receiverPhone ?? '',
            open_date: values.openDate,
            box_category: +values.boxCategory,
            is_setup: false,
            is_company_setup: false,
            last_opened: new Date(),
            open_after_a_day: false,
        });
    };

    console.log(initialValue?.box_campaign)

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
                        placeholder='Title of the gift box (optional)'
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
                        placeholder=''
                        control='phone-input'
                    />

                    <FormikControl
                        type='text'
                        name='boxCategory'
                        label='Box category'
                        placeholder='Select box category'
                        control='select'
                        defaultValue={initialValue?.box_campaign}
                        options={boxCategory ?? []}
                        handleChange={(value) => setFieldValue('boxCategory', value)}
                    />

                    <FormikControl
                        type='text'
                        name='openDate'
                        label='Open date'
                        placeholder=''
                        control='date-picker'
                    />

                    <FormikControl
                        type='text'
                        name='open_after_a_day'
                        label='Open after 24hrs'
                        placeholder=''
                        control='checkbox'
                    />

                    <Button
                        type='submit'
                        disabled={!(isValid && dirty) || isCreatePending || isUpdatePending}
                        isLoading={isCreatePending || isUpdatePending}
                        className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
                    >
                        Continue <ArrowRight size={18} className='text-white ml-2' />
                    </Button>
                </Form>
            )
            }
        </Formik>
    );
};

export default CreateBoxForm;
