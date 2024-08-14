'use client';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import FormikControl from '@/components/form-controls/FormikControl';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetConfigManagement, useUpdateConfigManagement } from '@/lib/hooks/useGetConfigManagement';
import { toast } from 'sonner';
import { get, set } from 'lodash';
import { Save } from 'lucide-react';

const validationSchema = Yup.object().shape({
    email_host: Yup.string().required('Email host is required'),
    email_port: Yup.number().required('Email port is required').positive('Must be a positive number'),
    email_host_user: Yup.string().required('Email host user is required'),
    email_host_password: Yup.string().required('Email host password is required'),
    company_api_key: Yup.string().required('Company API key is required'),
    super_admin_username: Yup.string().required('Super Admin username is required'),
    api_url: Yup.string().url('Must be a valid URL').required('API URL is required'),
    sendgrid_api_key: Yup.string().required('SendGrid API key is required'),
    twilio_account_sid: Yup.string().required('Twilio Account SID is required'),
    twilio_auth_token: Yup.string().required('Twilio Auth Token is required'),
    twilio_sid: Yup.string().required('Twilio SID is required'),
    twilio_number: Yup.string().required('Twilio number is required'),
    postgres_db_name: Yup.string().required('Postgres DB name is required'),
    postgres_db_user: Yup.string().required('Postgres DB user is required'),
    postgres_db_password: Yup.string().required('Postgres DB password is required'),
    postgres_db_host: Yup.string().required('Postgres DB host is required'),
    postgres_db_port: Yup.number().required('Postgres DB port is required').positive('Must be a positive number'),
    environment: Yup.string().required('Environment is required'),
    jwt_secret_key: Yup.string().required('JWT Secret Key is required'),
    token_min_length: Yup.number().required('Token min length is required').positive('Must be a positive number'),
    token_max_length: Yup.number().required('Token max length is required').positive('Must be a positive number'),
    login_with_email: Yup.boolean().required('Login with Email is required'),
    login_with_phone: Yup.boolean().required('Login with Phone is required'),
    under_maintenance: Yup.boolean().required('Under Maintenance is required'),
    maintenance_template: Yup.string().required('Maintenance template is required'),
    time_to_remind_users: Yup.string().required('Time to remind users is required'),
});

type FormSchema = Yup.InferType<typeof validationSchema>;

const SettingsForm = () => {
    const client = useQueryClient()
    const { data, isPending } = useGetConfigManagement()
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useUpdateConfigManagement({
        onSuccess() {
            toast.success('Settings updated successfully');
            client.invalidateQueries({ queryKey: ['config-management'] });
        },
    });

    const initialValues: FormSchema = {
        email_host: data?.email_host ?? '',
        email_port: data?.email_port ?? 587,
        email_host_user: data?.email_host_user ?? '',
        email_host_password: data?.email_host_password ?? '',
        company_api_key: data?.company_api_key ?? '',
        super_admin_username: data?.super_admin_username ?? '',
        api_url: data?.api_url ?? '',
        sendgrid_api_key: data?.sendgrid_api_key ?? '',
        twilio_account_sid: data?.twilio_account_sid ?? '',
        twilio_auth_token: data?.twilio_auth_token ?? '',
        twilio_sid: data?.twilio_sid ?? '',
        twilio_number: data?.twilio_number ?? '',
        postgres_db_name: data?.postgres_db_name ?? '',
        postgres_db_user: data?.postgres_db_user ?? '',
        postgres_db_password: data?.postgres_db_password ?? '',
        postgres_db_host: data?.postgres_db_host ?? '',
        postgres_db_port: data?.postgres_db_port ?? 5432,
        environment: data?.environment ?? '',
        jwt_secret_key: data?.jwt_secret_key ?? '',
        token_min_length: data?.token_min_length ?? 6,
        token_max_length: data?.token_max_length ?? 6,
        login_with_email: data?.login_with_email ?? false,
        login_with_phone: data?.login_with_phone ?? false,
        under_maintenance: data?.under_maintenance ?? false,
        maintenance_template: data?.maintenance_template ?? '',
        time_to_remind_users: data?.time_to_remind_users ?? '00:00:00',
    };

    const handleSubmit = (values: FormSchema) => {
        console.log("handle submit called")
        const data = {};
        Object.entries(initialValues).forEach(([key, oldVal]) => {
            const newVal = get(values, key);
            if (newVal !== oldVal) {
                set(data, key, newVal);
            }
        });
        console.log("updated data", data)
        mutateUpdate(data);
    };

    const [loading, setLoading] = useState(false);

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ dirty, isValid, handleChange, values, setFieldValue }) => (
                    <Form className="w-full flex flex-col space-y-6">
                        <Tabs defaultValue="general">
                            <TabsList className="border-b dark:border-gray-700">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="db">DB Settings</TabsTrigger>
                                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                                <TabsTrigger value="others">Others</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="py-8">
                                <div className="flex flex-col gap-6">
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="email_host"
                                        label="Email Host"
                                        placeholder="Enter email host"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="number"
                                        name="email_port"
                                        label="Email Port"
                                        placeholder="Enter email port"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="company_api_key"
                                        label="Company API Key"
                                        placeholder="Enter company API key"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="super_admin_username"
                                        label="Super Admin Username"
                                        placeholder="Enter super admin username"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="api_url"
                                        label="API URL"
                                        placeholder="Enter API URL"
                                    />
                                    <FormikControl
                                        type='text'
                                        control="select"
                                        name="environment"
                                        label="Environment"
                                        options={[
                                            { option: 'DEVELOPMENT', value: 'DEVELOPMENT' },
                                            { option: 'STAGING', value: 'STAGING' },
                                            { option: 'PRODUCTION', value: 'PRODUCTION' },
                                        ]}
                                    />
                                    <FormikControl
                                        type='text'
                                        control="checkbox"
                                        name="under_maintenance"
                                        label="Under Maintenance"
                                    />
                                    <FormikControl
                                        type='text'
                                        control="input"
                                        name="maintenance_template"
                                        label="Maintenance Template"
                                        placeholder="Enter maintenance template"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="time_to_remind_users"
                                        label="Time to Remind Users"
                                        placeholder="Enter time in HH:MM:SS format"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="db" className="py-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="postgres_db_name"
                                        label="Postgres DB Name"
                                        placeholder="Enter Postgres database name"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="postgres_db_user"
                                        label="Postgres DB User"
                                        placeholder="Enter Postgres database user"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="password"
                                        name="postgres_db_password"
                                        label="Postgres DB Password"
                                        placeholder="Enter Postgres database password"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="postgres_db_host"
                                        label="Postgres DB Host"
                                        placeholder="Enter Postgres database host"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="number"
                                        name="postgres_db_port"
                                        label="Postgres DB Port"
                                        placeholder="Enter Postgres database port"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="credentials" className="py-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="email_host_user"
                                        label="Email Host User"
                                        placeholder="Enter email host user"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="password"
                                        name="email_host_password"
                                        label="Email Host Password"
                                        placeholder="Enter email host password"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="sendgrid_api_key"
                                        label="SendGrid API Key"
                                        placeholder="Enter SendGrid API key"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="twilio_account_sid"
                                        label="Twilio Account SID"
                                        placeholder="Enter Twilio Account SID"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="password"
                                        name="twilio_auth_token"
                                        label="Twilio Auth Token"
                                        placeholder="Enter Twilio Auth Token"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="twilio_sid"
                                        label="Twilio SID"
                                        placeholder="Enter Twilio SID"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="text"
                                        name="twilio_number"
                                        label="Twilio Number"
                                        placeholder="Enter Twilio phone number"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="password"
                                        name="jwt_secret_key"
                                        label="JWT Secret Key"
                                        placeholder="Enter JWT secret key"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="others" className="py-8">
                                <div className="flex flex-col gap-6">
                                    <FormikControl
                                        control="input"
                                        type="number"
                                        name="token_min_length"
                                        label="Token Min Length"
                                        placeholder="Enter token min length"
                                    />
                                    <FormikControl
                                        control="input"
                                        type="number"
                                        name="token_max_length"
                                        label="Token Max Length"
                                        placeholder="Enter token max length"
                                    />
                                    <FormikControl
                                        type='text'
                                        control="checkbox"
                                        name="login_with_email"
                                        label="Login with Email"
                                    />
                                    <FormikControl
                                        type='text'
                                        control="checkbox"
                                        name="login_with_phone"
                                        label="Login with Phone"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className={`inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50`}
                                disabled={isUpdatePending || isPending}
                            >
                                Save <Save size={18} className='text-white ml-2' />
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>

    );
};

export default SettingsForm;
