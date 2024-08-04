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
import { adminCreateCompanyBox, adminUpdateCompanyBox } from '@/network-api/admin/endpoint';
import { useGetAdminBoxCategories, useGetAdminCompanies, useGetAdminCompanyUsers } from '@/lib/hooks/admin-hooks';
import { get, set } from 'lodash';

const validationSchema = Yup.object().shape({
    qty: Yup.number().min(0, 'Quantity be a non-negative number').optional(),
    company: Yup.number().optional(),
    box_type: Yup.number().optional(),
});

type AdminCreateCompanyFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCompanyBoxCreateForm = ({ initialValue, onClose }: { initialValue?: AdminCompanyBoxResponse, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // fetch the users
    const { data } = useGetAdminCompanies();
    const companies = data?.map(company => ({ option: company.name, value: company.id.toLocaleString() }));

    // fetch the box types
    const { data: box_type } = useGetAdminBoxCategories();
    const boxTypeOptions = box_type?.map(box_type => ({ option: box_type.name, value: box_type.id.toLocaleString() }));

    // mutate function for creating the company box
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminCompanyBoxRequest>({
        mutationFn: (req: AdminCompanyBoxRequest) => adminCreateCompanyBox(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('box created successfully');
            console.log({ data, variables, context })
            onClose();
            client.invalidateQueries({ queryKey: ['admin-company-boxes'] });
        },
        onError(error) {
            toast.error('Error creating box');
            console.error(error);
        },
    });

    // mutate function for updating the company box
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, any>({
        mutationFn: (req: AdminCompanyBoxRequest) => adminUpdateCompanyBox(initialValue?.id.toString() ?? '', session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('box updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-company-boxes'] });
        },
        onError(error) {
            toast.error('Error updating box');
            console.error(error);
        },
    });

    const initialValues = {
        comany: initialValue?.company ?? 1,
        qty: initialValue?.qty ?? 1,
        box_type: initialValue?.box_type.id ?? 1
    };

    const handleSubmit = (values: any) => {
        console.log("handle submit called")
        const data = {
            qty: values.qty ?? initialValue?.qty,
            company: values.company ?? initialValue?.company.id,
            box_type: values.box_type ?? initialValue?.box_type.id
        };

        if (query === 'update') {
            console.log("updated data", data)
            mutateUpdate(data);
        } else {
            const payload: AdminCreateCompanyFormSchema = {
                qty: values.qty,
                company: values.company,
                box_type: values.box_type
            };
            console.log({ payload })
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
                        type='number'
                        name='qty'
                        label='Quanity'
                        placeholder='Enter the quantity of boxes'
                        control='input'
                    />

                    <FormikControl
                        type='select'
                        name='company'
                        label='Company Owner'
                        placeholder='Select Company'
                        control='select'
                        options={companies ?? []}
                        handleChange={(value) => setFieldValue('company', Number(value))}
                    />
                    <FormikControl
                        type='select'
                        name='box_type'
                        label='box_type'
                        placeholder='Select box type'
                        control='select'
                        options={boxTypeOptions ?? []}
                        handleChange={(value) => setFieldValue('box_type', Number(value))}
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

export default AdminCompanyBoxCreateForm;
