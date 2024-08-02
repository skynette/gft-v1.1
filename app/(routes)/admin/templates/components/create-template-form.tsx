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
import { adminCreateTemplate, adminUpdateTemplate } from '@/network-api/admin/endpoint';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    notification_type: Yup.string().required('Notification type is required'),
    subject: Yup.string().required('Subject is required'),
    email_body: Yup.string().required('Email body is required'),
    sms_body: Yup.string().required('Sms body is required'),
    active: Yup.boolean(),
});

type AdminCreateTemplateFormSchema = Yup.InferType<typeof validationSchema>;

const AdminCreateTemplateForm = ({ initialValue, onClose }: { initialValue?: AdminTemplatesResponse, onClose: () => void }) => {
    const { data: session } = useSession();
    const query = useSearchParams()?.get('query') ?? null;
    const client = useQueryClient();

    // mutate function for creating the object
    const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<any, AxiosError, AdminTemplatesRequest>({
        mutationFn: (req: AdminTemplatesRequest) => adminCreateTemplate(session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('template created successfully');
            console.log({ data, variables, context });
            onClose();
            client.invalidateQueries({ queryKey: ['admin-templates'] });
        },
        onError(error) {
            toast.error('Error Creating template');
            console.error(error);
        },
    });

    // mutate function for updating the object
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation<any, AxiosError, AdminTemplatesRequest>({
        mutationFn: (req: AdminTemplatesRequest) => adminUpdateTemplate(initialValue?.id.toString()!, session?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('template updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['admin-templates'] });
        },
        onError(error) {
            toast.error('Error updating template');
            console.error(error);
        },
    });

    const initialValues: AdminCreateTemplateFormSchema = {
        name: initialValue?.name ?? '',
        notification_type: initialValue?.notification_type ?? '',
        subject: initialValue?.subject ?? '',
        email_body: initialValue?.email_body ?? '',
        sms_body: initialValue?.sms_body ?? '',
        active: initialValue?.active ?? false,
    };

    const handleSubmit = (values: AdminCreateTemplateFormSchema) => {
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
            mutateUpdate(data as AdminTemplatesRequest);
        } else {
            const payload: AdminTemplatesRequest = {
                name: values.name,
                subject: values.subject,
                notification_type: values.notification_type,
                email_body: values.email_body,
                sms_body: values.sms_body,
                active: values.active,
            };
            console.log({ payload })
            mutateCreate(payload);
        }
    };

    const TEMPLATE_CATEGORY_CHOICES = [
        ['notify_user_OTP', 'Notify User OTP'],
        ['verify_OTP', 'Verify OTP'],
        ['notify_sender_open_gift', 'Notify Sender Open Gift'],
        ['notify_receiver_to_open_gift', 'Notify Receiver to Open Gift'],
        ['notify_user_account_activity', 'Notify User Account Activity'],
        ['server_error', 'Server Error'],
        ['unauthorized', 'Unauthorized'],
        ['message', 'Message']
    ];

    const notification_type = TEMPLATE_CATEGORY_CHOICES.map(([value, option]) => ({
        value,
        option
    }));

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
                        name='name'
                        label='Name'
                        placeholder='Template Name'
                        control='input'
                    />
                    <FormikControl
                        type='text'
                        name='notification_type'
                        label='Type of Notification'
                        placeholder='Notification Type'
                        control='select'
                        options={notification_type ?? []}
                        handleChange={(value) => setFieldValue('notification_type', value)}
                    />
                    <FormikControl
                        type='text'
                        name='subject'
                        label='Subject'
                        placeholder='Subject'
                        control='input'
                    />
                    <FormikControl
                        type='text'
                        name='email_body'
                        label='Email Body'
                        placeholder='Email Body'
                        control='textarea'
                    />
                    <FormikControl
                        type='text'
                        name='sms_body'
                        label='SMS Body'
                        placeholder='SMS body'
                        control='textarea'
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

export default AdminCreateTemplateForm;
