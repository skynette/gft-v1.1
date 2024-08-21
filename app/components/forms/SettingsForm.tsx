'use client';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import useGetCompanyProfile, { useUpdateCompanyProfile } from '@/lib/hooks/useGetCompanyProfile';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import ImageUpload from '../form-controls/ImageUpload';
import { useState } from 'react';
import { toast } from 'sonner';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Company name is required'),
    logo: Yup.string().optional(),
    header: Yup.string().optional(),
    url: Yup.string().optional().url(),
    limit: Yup.number(),
    social: Yup.object().shape({
        twitter: Yup.string().optional(),
        facebook: Yup.string().optional(),
        linkedin: Yup.string().optional(),
        instagram: Yup.string().optional(),
        snapchat: Yup.string().optional(),
        youtube: Yup.string().optional(),
    }),

    color: Yup.object().shape({
        light: Yup.object().shape({
            primary: Yup.string().optional(),
            secondary: Yup.string().optional(),
            background: Yup.string().optional(),
            qrText: Yup.string().optional(),
            border: Yup.string().optional(),
            hover: Yup.string().optional(),
            foreground: Yup.string().optional(),
            header: Yup.string().optional(),
            footer: Yup.string().optional(),
        }),
        dark: Yup.object().shape({
            primary: Yup.string().optional(),
            secondary: Yup.string().optional(),
            background: Yup.string().optional(),
            qrText: Yup.string().optional(),
            border: Yup.string().optional(),
            hover: Yup.string().optional(),
            foreground: Yup.string().optional(),
            header: Yup.string().optional(),
            footer: Yup.string().optional(),
        }),
    }),
});

type FormSchema = Yup.InferType<typeof validationSchema>;

const SettingsForm = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useUpdateCompanyProfile({
        onSuccess() {
            toast.success("Updated")
            queryClient.invalidateQueries({
                queryKey: ['company-profile']
            });
        }
    });
    const { data } = useGetCompanyProfile();
    console.log(data);

    const initialValues: FormSchema = {
        name: data?.name ?? '',
        logo: data?.logo ?? '',
        header: data?.header_image ?? '',
        url: data?.company_url,
        limit: data?.box_limit,
        social: {
            twitter: data?.socials?.twitter_url ?? '',
            facebook: data?.socials?.facebook_url ?? '',
            instagram: data?.socials?.instagram_url ?? '',
            snapchat: data?.socials?.snapchat_url ?? '',
            youtube: data?.socials?.youtube_url ?? ''
        },
        color: {
            light: {
                primary: data?.color_schema.light.primary_color,
                secondary: data?.color_schema.light.secondary_color,
                qrText: data?.color_schema.light.qr_code_text_color,
                border: data?.color_schema.light.background_border_color,
                hover: data?.color_schema.light.background_hover_color,
                foreground: data?.color_schema.light.foreground_color,
                header: data?.color_schema.light.header_color,
                footer: data?.color_schema.light.footer_color,
            },
            dark: {
                primary: data?.color_schema.dark.primary_color,
                secondary: data?.color_schema.dark.secondary_color,
                qrText: data?.color_schema.dark.qr_code_text_color,
                border: data?.color_schema.dark.background_border_color,
                hover: data?.color_schema.dark.background_hover_color,
                foreground: data?.color_schema.dark.foreground_color,
                header: data?.color_schema.dark.header_color,
                footer: data?.color_schema.dark.footer_color,
            }
        }
    }

    const handleSubmit = (values: FormSchema) => {
        mutate({
            name: values.name,
            logo: values.logo ?? initialValues.logo,
            header_image: values.header ?? initialValues.header,
            box_limit: values.limit ?? 0,
            company_url: values.url ?? '',
            socials: {
                facebook_url: values.social.facebook ?? '',
                instagram_url: values?.social.instagram ?? '',
                twitter_url: values?.social.twitter ?? '',
                snapchat_url: values?.social?.snapchat ?? '',
                youtube_url: values?.social?.youtube ?? ''
            },
            color_schema: {
                light: {
                    primary_color: values?.color.light.primary ?? '#0ff',
                    secondary_color: values?.color.light.secondary ?? '#0ff',
                    qr_code_text_color: values?.color.light.qrText ?? '#000',
                    background_border_color: values?.color.light.border ?? '#0f0',
                    background_color: values?.color.light.background ?? '#fff',
                    background_hover_color: values?.color.light.hover ?? '#fff',
                    header_color: values?.color.light.header ?? '#00f',
                    foreground_color: values?.color.light.foreground ?? '#fff',
                    footer_color: values?.color.light.footer ?? '#000'
                },
                dark: {
                    primary_color: values?.color.dark.primary ?? '#0ff',
                    secondary_color: values?.color.dark.secondary ?? '#0ff',
                    qr_code_text_color: values?.color.dark.qrText ?? '#000',
                    background_border_color: values?.color.dark.border ?? '#0f0',
                    background_color: values?.color.dark.background ?? '#fff',
                    background_hover_color: values?.color.dark.hover ?? '#fff',
                    header_color: values?.color.dark.header ?? '#00f',
                    foreground_color: values?.color.dark.foreground ?? '#fff',
                    footer_color: values?.color.dark.footer ?? '#000'
                }
            }
        });
    };

    const [loading, setLoading] = useState(false)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ dirty, isValid, handleChange, values, setFieldValue }) => (
                <Form className='w-full flex flex-col space-y-5'>
                    <div className="grid gap-6">
                        {/* General Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <FormikControl
                                    type='text'
                                    name='name'
                                    label='Name'
                                    control='input'
                                    placeholder='Company name'
                                />
                                <div className='flex flex-col'>
                                    <p className='text-sm'>Upload logo</p>
                                    <ImageUpload
                                        value={values.logo ? [values.logo] : []}
                                        disabled={loading}
                                        onChange={(url) => setFieldValue('logo', url)}
                                        onRemove={() => setFieldValue('logo', '')}
                                    />
                                </div>

                                <div className='flex flex-col'>
                                    <p className='text-sm'>Upload header</p>
                                    <ImageUpload
                                        value={values.header ? [values.header] : []}
                                        disabled={loading}
                                        onChange={(url) => setFieldValue('header', url)}
                                        onRemove={() => setFieldValue('header', '')}
                                    />
                                </div>

                                {/* <FormikControl
                                    type='file'
                                    name='header'
                                    label='Upload header'
                                    control='input'
                                    placeholder='Company logo'
                                /> */}

                                <FormikControl
                                    type='text'
                                    name='url'
                                    label='Company url'
                                    control='input'
                                    placeholder='Company url'
                                />

                                <FormikControl
                                    type='text'
                                    name='limit'
                                    label='Box limit'
                                    control='input'
                                    disabled
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6">
                        {/* Socials Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Socials</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <FormikControl
                                        type='text'
                                        name='social.twitter'
                                        label='Twitter'
                                        control='input'
                                        placeholder='twitter profile link'
                                    />

                                    <FormikControl
                                        type='text'
                                        name='social.facebook'
                                        label='Facebook'
                                        control='input'
                                        placeholder='facebook profile link'
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <FormikControl
                                        type='text'
                                        name='social.instagram'
                                        label='Instagram'
                                        control='input'
                                        placeholder='instagram profile link'
                                    />

                                    <FormikControl
                                        type='text'
                                        name='social.snapchat'
                                        label='Snapchat'
                                        control='input'
                                        placeholder='snapchat profile link'
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <FormikControl
                                        type='text'
                                        name='social.youtube'
                                        label='Youtube'
                                        control='input'
                                        placeholder='youtube profile link'
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6">
                        {/* Socials Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Color Schema</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className='flex flex-col'>
                                    <p className='font-semibold text-lg'>Light</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.light.primary'
                                            type='color'
                                            label='Primary color'
                                            control='input'
                                        />

                                        <FormikControl
                                            name='color.light.secondary'
                                            type='color'
                                            label='Secondary color'
                                            control='input'
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.light.background'
                                            type='color'
                                            label='Background color'
                                            control='input'
                                        />

                                        <FormikControl
                                            name='color.light.qrText'
                                            type='color'
                                            label='QR Code Text Color'
                                            control='input'
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.light.border'
                                            type='color'
                                            label='Background Border Color'
                                            control='input'
                                        />

                                        <FormikControl
                                            name='color.light.hover'
                                            type='color'
                                            label='Background Hover Color'
                                            control='input'
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.light.foreground'
                                            type='color'
                                            label='Foreground Color'
                                            control='input'
                                        />

                                        <FormikControl
                                            name='color.light.header'
                                            type='color'
                                            label='Header Color'
                                            control='input'
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.light.footer'
                                            type='color'
                                            label='Footer Color'
                                            control='input'
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col !mt-4'>
                                    <p className='font-semibold text-lg'>Dark</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.dark.primary'
                                            type='color'
                                            label='Primary color'
                                            control='input'
                                        />

                                        <FormikControl
                                            name='color.dark.secondary'
                                            type='color'
                                            label='Secondary color'
                                            control='input'
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.dark.background'
                                            type='color'
                                            label='Background color'
                                            control='input'
                                        />

                                        <FormikControl
                                            name='color.dark.qrText'
                                            type='color'
                                            label='QR Code Text Color'
                                            control='input'
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.dark.border'
                                            type='color'
                                            label='Background Border Color'
                                            control='input'
                                        />

                                        <FormikControl
                                            name='color.dark.hover'
                                            type='color'
                                            label='Background Hover Color'
                                            control='input'
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.dark.foreground'
                                            type='color'
                                            label='Foreground Color'
                                            control='input'
                                        />

                                        <FormikControl
                                            name='color.dark.header'
                                            type='color'
                                            label='Header Color'
                                            control='input'
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <FormikControl
                                            name='color.dark.footer'
                                            type='color'
                                            label='Footer Color'
                                            control='input'
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Button
                        type='submit'
                        disabled={isPending}
                        isLoading={isPending}
                        className='w-fit items-center px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
                    >
                        Save changes
                    </Button>
                </Form>
            )
            }
        </Formik>
    );
};

export default SettingsForm;
