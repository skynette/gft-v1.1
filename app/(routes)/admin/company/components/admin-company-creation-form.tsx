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
import { adminCreateCompany, adminUpdateCompany } from '@/network-api/admin/endpoint';
import { useGetAdminCompanyUsers } from '@/lib/hooks/admin-hooks';
import { get, set } from 'lodash';

const validationSchema = Yup.object().shape({
    owner: Yup.number().optional(),
    name: Yup.string().required('Company name is required'),
    logo: Yup.string().url('Must be a valid URL').optional(),
    header_image: Yup.string().url('Must be a valid URL').optional(),
    company_url: Yup.string().url('Must be a valid URL').optional(),
    box_limit: Yup.number().min(0, 'Box limit must be a non-negative number').optional(),
});

type AdminCreateCompanyFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCompanyCreateForm = ({ initialValue, onClose }: { initialValue?: AdminCompanyResponse, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // fetch the users
    const { data } = useGetAdminCompanyUsers();
    const companyUsers = data?.map(user => ({ option: user.email, value: user.pkid.toLocaleString() }));

    // mutate function for creating the company
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminCompanyRequest>({
        mutationFn: (req: AdminCompanyRequest) => adminCreateCompany(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Company created successfully');
            console.log({ data, variables, context })
            onClose();
            client.invalidateQueries({ queryKey: ['admin-companies'] });
        },
        onError(error) {
            toast.error('Error creating company');
            console.error(error);
        },
    });

    // mutate function for updating the company
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, any>({
        mutationFn: (req: AdminCompanyRequest) => adminUpdateCompany(initialValue?.id.toString() ?? '', session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Company updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-companies'] });
        },
        onError(error) {
            toast.error('Error updating company');
            console.error(error);
        },
    });

    const initialValues: AdminCreateCompanyFormSchema = {
        owner: initialValue?.owner ?? 1,
        name: initialValue?.name ?? '',
        logo: initialValue?.logo ?? '',
        header_image: initialValue?.header_image ?? '',
        company_url: initialValue?.company_url ?? '',
        box_limit: initialValue?.box_limit ?? 0,
    };

    const handleSubmit = (values: AdminCreateCompanyFormSchema) => {
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
            const payload: AdminCompanyRequest = {
                owner: values.owner,
                name: values.name,
                logo: values.logo,
                header_image: values.header_image,
                company_url: values.company_url,
                box_limit: values.box_limit,
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
                        name='name'
                        label='Company Name'
                        placeholder='Enter the company name'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='logo'
                        label='Company Logo URL'
                        placeholder='Enter the logo URL'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='header_image'
                        label='Header Image URL'
                        placeholder='Enter the header image URL'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='company_url'
                        label='Company Website URL'
                        placeholder='Enter the company website URL'
                        control='input'
                    />

                    <FormikControl
                        type='number'
                        name='box_limit'
                        label='Box Limit'
                        placeholder='Enter the box limit'
                        control='input'
                    />

                    <FormikControl
                        type='select'
                        name='owner'
                        label='Company Owner'
                        placeholder='Select Company Owner'
                        control='select'
                        options={companyUsers ?? []}
                        handleChange={(value) => setFieldValue('owner', Number(value))}
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

export default AdminCompanyCreateForm;
