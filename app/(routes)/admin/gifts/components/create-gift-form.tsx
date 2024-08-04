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
import { adminCreateGifts, adminUpdateGifts } from '@/network-api/admin/endpoint';
import { useGetAdminBoxes, useGetAdminCampaigns, useGetAdminUsers } from '@/lib/hooks/admin-hooks';
import { get, set } from 'lodash';

const validationSchema = Yup.object().shape({
    gift_title: Yup.string().required('Must have a title'),
    gift_description: Yup.string().optional(),
    gift_content_type: Yup.string().optional(),
    opened: Yup.boolean().optional(),
    open_date: Yup.string().optional(),
    user: Yup.number().required("User cannot be blank"),
    box_model: Yup.number().required('Select box model'),
    gift_campaign: Yup.number().required('Select gift campaign'),
});

type AdminCreateFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateGiftForm = ({ initialValue, onClose }: { initialValue?: AdminGiftRequest, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // fetch the campaigns
    const { data } = useGetAdminCampaigns();
    const boxCampaigns = data?.map(campaign => ({ option: campaign.name, value: campaign.pkid.toLocaleString() }));

    // fetch the box models
    const { data: boxes } = useGetAdminBoxes();
    const boxModels = boxes?.map(box => ({ option: box.title, value: box.pkid.toLocaleString() }));

    // fetch the users
    const { data: users } = useGetAdminUsers();
    const userOptions = users?.map(user => ({ option: user.email, value: user.pkid.toString() }))

    // mutate function for creating the gift
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminGiftRequest>({
        mutationFn: (req: AdminGiftRequest) => adminCreateGifts(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Gift created successfully');
            console.log({ data, variables, context })
            onClose();
            client.invalidateQueries({ queryKey: ['admin-gifts'] });
        },
        onError(error) {
            toast.error('Error creating gift');
            console.error(error);
        },
    });

    // mutate function for updating the gift
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, any>({
        mutationFn: (req: AdminGiftRequest) => adminUpdateGifts(initialValue?.id ?? '', session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Gift updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-gifts'] });
        },
        onError(error) {
            toast.error('Error updating gift');
            console.error(error);
        },
    });

    const initialValues: AdminCreateFormSchema = {
        gift_title: initialValue?.gift_title ?? '',
        gift_description: initialValue?.gift_description ?? '',
        gift_content_type: initialValue?.gift_content_type ?? '',
        opened: initialValue?.opened ?? false,
        open_date: initialValue?.open_date ?? '',
        user: initialValue?.user ?? 1,
        box_model: initialValue?.box_model ?? 1,
        gift_campaign: initialValue?.gift_campaign ?? 1,
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
            const payload: AdminGiftRequest = {
                gift_title: values.gift_title,
                gift_description: values.gift_description,
                gift_content_type: values.gift_content_type,
                opened: values.opened,
                open_date: values.open_date,
                user: values.user,
                box_model: values.box_model,
                gift_campaign: values.gift_campaign
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
                        name='gift_title'
                        label='Gift Title'
                        placeholder='Title of the gift'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='gift_description'
                        label='Gift Description'
                        placeholder='Description of the gift'
                        control='textarea'
                    />

                    <FormikControl
                        type='text'
                        name='gift_content_type'
                        label='Gift Content Type'
                        placeholder='Content type of the gift'
                        control='input'
                    />

                    <FormikControl
                        type='checkbox'
                        name='opened'
                        label='Opened'
                        control='checkbox'
                    />

                    <FormikControl
                        type='date'
                        name='open_date'
                        label='Open Date'
                        placeholder='Select open date'
                        control='date-picker'
                    />

                    <FormikControl
                        type='text'
                        name='user'
                        label='User'
                        placeholder='User'
                        control='select'
                        options={userOptions ?? []}
                        handleChange={(value) => setFieldValue('user', Number(value))}
                    />

                    <FormikControl
                        type='select'
                        name='box_model'
                        label='Box Model'
                        placeholder='Select box model'
                        control='select'
                        options={boxModels ?? []}
                        handleChange={(value) => setFieldValue('box_model', Number(value))}
                    />

                    <FormikControl
                        type='select'
                        name='gift_campaign'
                        label='Gift Campaign'
                        placeholder='Select gift campaign'
                        control='select'
                        options={boxCampaigns ?? []}
                        handleChange={(value) => setFieldValue('gift_campaign', Number(value))}
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

export default AdminCreateGiftForm;
