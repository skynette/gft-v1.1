'use client';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import FormikControl from '@/components/form-controls/FormikControl';
import { Button } from '@/components/ui/button';
import { get, set } from 'lodash';
import { adminCreateCampaign, adminUpdateCampaign } from '@/network-api/admin/endpoint';
import { useGetAdminCampaignById, useGetAdminCompanyBoxes } from '@/lib/hooks/admin-hooks';
import ImageUpload from '@/components/form-controls/ImageUpload';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object().shape({
    company_boxes: Yup.string()
        .max(255, 'Company name cannot exceed 255 characters')
        .optional(),

    name: Yup.string()
        .required('Name is required')
        .max(255, 'Name cannot exceed 255 characters'),

    box_type: Yup.string()
        .max(255, 'Box type cannot exceed 255 characters')
        .optional(),

    duration: Yup.number()
        .integer('Duration must be an integer')
        .min(0, 'Duration cannot be negative')
        .optional(),

    num_boxes: Yup.number()
        .integer('Number of boxes must be an integer')
        .min(0, 'Number of boxes cannot be negative')
        .optional(),

    header_image: Yup.string()
        .url('Header image must be a valid URL')
        .optional(),

    open_after_a_day: Yup.boolean()
        .optional(),
});

type AdminCreateCampaignFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateCampaignForm = () => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const id = useSearchParams()?.get('id') ?? null;
    const client = useQueryClient();
    const router = useRouter()

    const { data: initialValue, isPending: campaignPending, isSuccess, refetch } = useGetAdminCampaignById(id!);

    useEffect(() => {
        refetch();
    }, [id, query, refetch]);

    // mutate function for creating the campaign
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminCampaignRequest>({
        mutationFn: (req: AdminCampaignRequest) => adminCreateCampaign(session?.accessToken ?? '', session?.companyAPIKey ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Campaign created successfully');
            console.log({ data, variables, context });
            client.invalidateQueries({ queryKey: ['admin-campaigns'] });
            router.push("/admin/campaigns")
        },
        onError(error) {
            toast.error('Error Creating Campaign');
            console.error(error);
        },
    });

    // mutate function for updating the campaign
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, AdminCampaignRequest>({
        mutationFn: (req: AdminCampaignRequest) => adminUpdateCampaign(initialValue?.id!, session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Campaign updated successfully');
            client.invalidateQueries({ queryKey: ['admin-campaigns'] });
            router.push("/admin/campaigns")
        },
        onError(error) {
            toast.error('Error updating campaign');
            console.error(error);
        },
    });

    const initialValues: AdminCreateCampaignFormSchema = {
        name: initialValue?.name ?? '',
        box_type: initialValue?.box_type ?? '',
        duration: initialValue?.duration ?? undefined,
        num_boxes: initialValue?.num_boxes ?? undefined,
        header_image: initialValue?.header_image ?? '',
        open_after_a_day: initialValue?.open_after_a_day ?? false,
        company_boxes: initialValue?.company_boxes ?? '',
    };

    const handleSubmit = (values: AdminCreateCampaignFormSchema) => {
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
            mutateUpdate(data as AdminCampaignRequest);
        } else {
            const payload: AdminCampaignRequest = {
                name: values.name,
                box_type: values.box_type,
                duration: values.duration,
                num_boxes: values.num_boxes,
                header_image: values.header_image,
                open_after_a_day: values.open_after_a_day,
                company_boxes: values.company_boxes,
            };
            mutateCreate(payload);
        }
    };

    const [loading, setLoading] = useState(false)

    const { data: companyBoxes, isPending } = useGetAdminCompanyBoxes()
    const companyBoxesOptions = companyBoxes?.map(box => ({ option: box.company.name, value: box.id.toLocaleString() }));

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ dirty, isValid, values, isSubmitting, setFieldValue }) => (
                <Form className='w-full flex flex-col space-y-5 mt-[5%]'>
                    <FormikControl
                        type='text'
                        name='company_boxes'
                        label='Company Box'
                        placeholder='Company Box'
                        control='select'
                        options={companyBoxesOptions ?? []}
                        handleChange={(value) => setFieldValue('company_boxes', value)}
                    />

                    <FormikControl
                        type='text'
                        name='name'
                        label='Name'
                        placeholder='Name of the campaign'
                        control='input'
                    />

                    <FormikControl
                        type='number'
                        name='duration'
                        label='Duration'
                        placeholder='Duration in days (optional)'
                        control='input'
                    />

                    <FormikControl
                        type='number'
                        name='num_boxes'
                        label='Number of Boxes'
                        placeholder='Number of boxes (optional)'
                        control='input'
                    />

                    <div className='flex flex-col'>
                        <p className='text-sm'>Upload header image</p>
                        <ImageUpload
                            value={values.header_image ? [values.header_image] : []}
                            disabled={loading}
                            onChange={(url) => setFieldValue('header_image', url)}
                            onRemove={() => setFieldValue('header_image', '')}
                        />
                    </div>

                    {/* <FormikControl
                        type='text'
                        name='header_image'
                        label='Header Image URL'
                        placeholder='URL of the header image (optional)'
                        control='input'
                    /> */}

                    <FormikControl
                        type='checkbox'
                        name='open_after_a_day'
                        label='Open after 24 hours'
                        control='checkbox'
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

export default AdminCreateCampaignForm;
