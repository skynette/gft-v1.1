'use client';

import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import { Button } from '../ui/button';
import { ArrowRight, CloudUpload, XCircle } from 'lucide-react';
import useGetCompanyCategorybox from '@/lib/hooks/useGetCompanyCategorybox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCampaign } from '@/network-api/dashboard/endpoint';
import { useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { CreateCampaignRequest } from '@/lib/response-type/company_dashboard/CreateCampaignRequest';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Input } from '../ui/input';
import { nanoid } from 'nanoid';
import Image from 'next/image';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Provide campaign name'),
    company_boxes: Yup.string().required('Select company'),
    duration: Yup.number().required('Provide campaign duration').min(1, 'Duration too low'),
    num_boxes: Yup.number().required('Provide number of boxes').min(1, 'Number of boxes too low'),
    header_image: Yup.mixed().required('Provide campaign image'),
    open_after_a_day: Yup.boolean().optional(),
});

type CreateCampaignFormSchema = Yup.InferType<typeof validationSchema>;

const CreateCampaignForm = ({ onClose }: { onClose: () => void }) => {
    const session = useSession();
    const { data } = useGetCompanyCategorybox();
    const client = useQueryClient()
    const boxCategory = data?.map(box => ({ option: box.box_type.name, value: box.box_type.id.toString() }));
    const [headerImg, setHeaderImg] = useState<any | null>('');

    const { mutate, isPending } = useMutation<any, AxiosError, CreateCampaignRequest>({
        mutationFn: (req: CreateCampaignRequest) => createCampaign(session?.data?.accessToken ?? '', session?.data?.companyAPIKey ?? '', req),
        onSuccess(data, variables, context) {
            toast.success('Campaign created successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['company-campaigns'] })
        },
    });

    const initialValues: CreateCampaignFormSchema = {
        name: '',
        company_boxes: '',
        duration: 0,
        num_boxes: 0,
        header_image: '',
        open_after_a_day: false
    }

    const handleSubmit = (values: CreateCampaignFormSchema) => {
        mutate({
            name: values.name,
            company_boxes: values.company_boxes,
            duration: values.duration,
            num_boxes: values.num_boxes,
            header_image: values.header_image,
            open_after_a_day: values.open_after_a_day ?? false,
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, setFieldValue }) => (
                <Form className='w-full flex flex-col space-y-5 mt-[5%]'>
                    <FormikControl
                        type='text'
                        name='name'
                        label='Campaign name'
                        placeholder='Provide campaign name'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='company_boxes'
                        label='Box category'
                        placeholder='Select box category'
                        control='select'
                        options={boxCategory ?? []}
                        handleChange={(value) => setFieldValue('company_boxes', value)}
                    />

                    <FormikControl
                        type='text'
                        name='duration'
                        label='Campaign duration (days)'
                        placeholder='3'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='num_boxes'
                        label='Number of boxes'
                        placeholder='10'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='openDate'
                        label='Open date'
                        placeholder=''
                        control='date-picker'
                    />

                    <FormikControl
                        type='text'
                        name='open_after_a_day'
                        label='Open after 24hrs'
                        placeholder=''
                        control='checkbox'
                    />

                    <div className='w-full'>
                        <p className='font-normal text-sm'>Header image</p>
                        <div className='flex flex-col space-y-2 my-4'>
                            {
                                errors && <p className='text-xs text-red-600 font-normal'>{errors?.header_image?.toString()}</p>
                            }
                            <Field name='header_image'>
                                {
                                    (props: FieldProps) => (
                                        <Dropzone maxFiles={1} accept={{
                                            'image/jpeg': [],
                                            'image/png': []
                                        }} onDrop={acceptedFiles => {
                                            props.form.setFieldValue('header_image', acceptedFiles[0]);
                                            acceptedFiles.forEach((file) => {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    setHeaderImg(reader.result);
                                                }
                                                reader.readAsDataURL(file);
                                            })
                                        }}>
                                            {({ getRootProps, getInputProps, isDragActive }) => (
                                                <div {...getRootProps()} className='flex flex-col items-center text-center p-6 rounded-lg border border-dashed border-primary'>
                                                    <Input {...getInputProps()} />
                                                    <CloudUpload className='w-10 h-10' />
                                                    {
                                                        isDragActive ?
                                                            <p className='text-primary font-semibold text-lg'>Drop the files here ...</p> :
                                                            <p className='text-xs font-normal text-[#0B0B0B] mt-2'> Drag your file(s) or <span className='text-primary'>browse</span></p>
                                                    }
                                                    <p className='text-[#444A5B] text-[14px] font-medium'>jpg or png</p>
                                                </div>
                                            )}
                                        </Dropzone>
                                    )
                                }
                            </Field>
                        </div>
                        {
                            headerImg &&
                            <div className='flex mt-2 space-x-2 items-center justify-center bg-slate-200 my-2 p-2'>
                                {
                                    <div key={nanoid()} className='relative'>
                                        <Image src={headerImg} width={150} height={150} alt='' />
                                        <Button type='button' onClick={() => {
                                            setFieldValue('header_image', '');
                                            setHeaderImg(null);
                                        }}
                                            className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'
                                            variant='ghost'
                                            size='icon'>
                                            <XCircle className='rounded-full bg-black text-white w-8 h-8' strokeWidth={1} />
                                        </Button>
                                    </div>
                                }
                            </div>
                        }
                    </div>

                    <Button
                        type='submit'
                        disabled={isPending}
                        isLoading={isPending}
                        className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
                    >
                        Continue <ArrowRight size={18} className='text-white ml-2' />
                    </Button>
                </Form>
            )
            }
        </Formik>
    );
};

export default CreateCampaignForm;
