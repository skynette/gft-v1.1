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
import { adminCreateBoxCategory, adminUpdateBoxCategory } from '@/network-api/admin/endpoint';
import { get, set } from 'lodash';

const validationSchema = Yup.object().shape({
    id: Yup.string()
        .required('ID is required'),

    name: Yup.string()
        .required('Name is required')
        .max(255, 'Name cannot exceed 255 characters'),

    label: Yup.string()
        .max(255, 'Label cannot exceed 255 characters'),

    category: Yup.string()
        .required("Category is required")
        .max(255, 'Category cannot exceed 255 characters'),

    qty: Yup.number()
        .integer('Quantity must be an integer')
        .required('Quantity is required')
        .min(0, 'Quantity cannot be negative'),

    created_at: Yup.date().optional(),

    updated_at: Yup.date().optional(),
});

type AdminCreateBoxCategoryFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateBoxCategoryForm = ({ initialValue, onClose }: { initialValue?: AdminBoxCategoryResponse, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminBoxCategoryRequest>({
        mutationFn: (req: AdminBoxCategoryRequest) => adminCreateBoxCategory(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Box Category created successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-box-categories'] });
        },
        onError(error) {
            toast.error('Error creating box category');
            console.error(error);
        },
    });

    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, AdminBoxCategoryRequest>({
        mutationFn: (req: AdminBoxCategoryRequest) => adminUpdateBoxCategory(initialValue?.id ?? '1', session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Box Category updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-box-categories'] });
        },
        onError(error) {
            toast.error('Error updating box category');
            console.error(error);
        },
    });

    const initialValues: AdminCreateBoxCategoryFormSchema = {
        id: initialValue?.id ?? '1',
        name: initialValue?.name ?? '',
        label: initialValue?.label ?? '',
        category: initialValue?.category ?? '',
        qty: initialValue?.qty ?? 1,
        // created_at: initialValue?.created_at ? new Date(initialValue.created_at) : new Date(),
        // updated_at: initialValue?.updated_at ? new Date(initialValue.updated_at) : new Date(),
    };

    const handleSubmit = (values: AdminCreateBoxCategoryFormSchema) => {
        console.log("handle submit pressed")
        const data = {};
        Object.entries(initialValues).forEach(([key, oldVal]) => {
            const newVal = get(values, key);
            if (newVal !== oldVal) {
                set(data, key, newVal);
            }
        });
        if (query === 'update') {
            console.log("update action", data)
            mutateUpdate(data as AdminBoxCategoryRequest);
        } else {
            const payload: AdminBoxCategoryRequest = {
                name: values.name,
                category: values.category,
                qty: values.qty,
            };
            console.log("create action", payload)
            mutateCreate(payload);
        }
    };

    const categoryOptions = [
        {
            option: "3 Days",
            value: "3"
        },
        {
            option: "7 Days",
            value: "7"
        },
        {
            option: "14 Days",
            value: "14"
        },
        {
            option: "30 Days",
            value: "30"
        },
    ]

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
                        label='Name'
                        placeholder='Name of the box category'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='label'
                        label='Label'
                        placeholder='Label for the box category (auto generated slug)'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='category'
                        label='Category'
                        placeholder='Category of the box'
                        control='select'
                        options={categoryOptions}
                        handleChange={(value) => setFieldValue('category', value)}
                    />

                    <FormikControl
                        type='number'
                        name='qty'
                        label='Quantity'
                        placeholder='Number of items in the box'
                        control='input'
                    />

                    {/* <FormikControl
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
                    /> */}

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

export default AdminCreateBoxCategoryForm;
