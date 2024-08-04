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
import { adminCreateGiftVisits, adminUpdateGiftVisits } from '@/network-api/admin/endpoint';
import { useGetAdminGifts, useGetAdminUsers } from '@/lib/hooks/admin-hooks';
import { get, set } from 'lodash';

const validationSchema = Yup.object().shape({
    visitor: Yup.number().optional(),
    gift: Yup.number().optional(),
});

type AdminCreateFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateGiftVisitForm = ({ initialValue, onClose }: { initialValue?: AdminGiftVisitsResponse, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // fetch the gifts
    const { data } = useGetAdminGifts();
    const giftOptions = data?.map(gift => ({ option: gift.gift_title, value: gift.pkid.toLocaleString() }));
    
    // fetch the users
    const { data: users } = useGetAdminUsers();
    const userOptions = users?.map(user => ({ option: user.email, value: user.pkid.toString() }))

    // mutate function for creating the gift
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminGiftVisitsRequest>({
        mutationFn: (req: AdminGiftVisitsRequest) => adminCreateGiftVisits(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Visit created successfully');
            console.log({ data, variables, context })
            onClose();
            client.invalidateQueries({ queryKey: ['admin-giftvisits'] });
        },
        onError(error) {
            toast.error('Error creating visit');
            console.error(error);
        },
    });

    // mutate function for updating the gift
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, any>({
        mutationFn: (req: AdminGiftVisitsRequest) => adminUpdateGiftVisits(initialValue?.id?.toString()!, session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Visit updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-giftvisits'] });
        },
        onError(error) {
            toast.error('Error updating visit');
            console.error(error);
        },
    });

    const initialValues = {
        gift: Number(initialValue?.gift.id) ?? 1,
        visitor: Number(initialValue?.visitor.id) ?? 1
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
            const payload = {
                gift: values?.gift,
                visitor: values?.visitor,
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
                        name='user'
                        label='User'
                        placeholder='User'
                        control='select'
                        options={userOptions ?? []}
                        handleChange={(value) => setFieldValue('user', Number(value))}
                    />

                    <FormikControl
                        type='select'
                        name='gift'
                        label='Gift'
                        placeholder='Select Gift'
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

export default AdminCreateGiftVisitForm;
