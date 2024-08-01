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
import { get, set } from 'lodash';
import { adminCreateAPIKey, adminUpdateAPIkey } from '@/network-api/admin/endpoint';
import { useGetAdminCompanies } from '@/lib/hooks/admin-hooks';

const validationSchema = Yup.object().shape({
    key: Yup.string()
        .max(255, 'Key cannot exceed 255 characters')
        .optional(),

    max_requests: Yup.number()
        .integer('Maximum requests must be an integer')
        .min(0, 'Maximum requests cannot be negative')
        .optional(),

    company: Yup.number()
        .integer('Company ID must be an integer')
        .optional(),
});;

type AdminCreateAPIKeyFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateAPIKeyForm = ({ initialValue, onClose }: { initialValue?: AdminCompanyAPIKeyResponse, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // mutate function for creating the object
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminCompanyAPIKeyRequest>({
        mutationFn: (req: AdminCompanyAPIKeyRequest) => adminCreateAPIKey(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('api key created successfully');
            console.log({ data, variables, context });
            onClose();
            client.invalidateQueries({ queryKey: ['admin-company-api-keys'] });
        },
        onError(error) {
            toast.error('Error Creating key');
            console.error(error);
        },
    });

    // mutate function for updating the object
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, AdminCompanyAPIKeyRequest>({
        mutationFn: (req: AdminCompanyAPIKeyRequest) => adminUpdateAPIkey(initialValue?.id.toLocaleString()!, session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('API key updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-company-api-keys'] });
        },
        onError(error) {
            toast.error('Error updating api key');
            console.error(error);
        },
    });

    const initialValues: AdminCreateAPIKeyFormSchema = {
        key: initialValue?.key ?? '',
        max_requests: initialValue?.max_requests ?? 100,
        company: initialValue?.company ?? 1,
    };

    const handleSubmit = (values: AdminCreateAPIKeyFormSchema) => {
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
            mutateUpdate(data as AdminCompanyAPIKeyRequest);
        } else {
            console.log("creating")
            const payload: AdminCompanyAPIKeyRequest = {
                company: values.company,
                max_requests: values.max_requests
            };
            console.log({ payload })
            mutateCreate(payload);
        }
    };

    const { data: companies } = useGetAdminCompanies()
    const companyOptions = companies?.map(company => ({ option: company.name, value: company.id.toLocaleString() }));

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
                        name='company'
                        label='Company'
                        placeholder='Company'
                        control='select'
                        options={companyOptions ?? []}
                        handleChange={(value) => setFieldValue('company', Number(value))}
                    />
                    <FormikControl
                        type='text'
                        name='key'
                        label='Key'
                        placeholder='Key (auto generated)'
                        control='input'
                    />
                    <FormikControl
                        type='text'
                        name='max_requests'
                        label='Maximum Requests'
                        placeholder='Maximum Requests'
                        control='input'
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

export default AdminCreateAPIKeyForm;
