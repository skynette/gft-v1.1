'use client';

import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import { Button } from '../ui/button';
import { ArrowRight, CloudUpload, XCircle } from 'lucide-react';
import useGetCompanyCategorybox from '@/lib/hooks/useGetCompanyCategorybox';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Dropzone from 'react-dropzone';
import { Input } from '../ui/input';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { CampaignColumns } from '@/(routes)/dashboard/(company_dashboard)/components/campaign-columns';
import { useSearchParams } from 'next/navigation';
import useCreateCampaign from '@/lib/hooks/useCreateCampaign';
import useUpdateCampaign from '@/lib/hooks/useUpdateCampaign';
import ImageUpload from '../form-controls/ImageUpload';

const CreateCampaignForm = ({ initialValue, onClose }: { initialValue?: CampaignColumns, onClose: () => void }) => {
    const { data } = useGetCompanyCategorybox();
    const query = useSearchParams().get('query') ?? null;
    const client = useQueryClient()
    const boxCategory = data?.map(box => ({ option: box.box_type.name, value: box.box_type.id.toString() }));

    const createValidationSchema = Yup.object().shape({
        name: Yup.string().required('Provide campaign name'),
        company_boxes: Yup.string().required('Select company'),
        // duration: Yup.number().required('Provide campaign duration').min(1, 'Duration too low'),
        num_boxes: Yup.number().required('Provide number of boxes').min(1, 'Number of boxes too low'),
        header_image: Yup.string().url('Invalid URL format').optional(),
        open_after_a_day: Yup.boolean().optional(),
    });

    const updateValidationSchema = Yup.object().shape({
        name: Yup.string().required('Provide campaign name'),
        num_boxes: Yup.number().required('Provide number of boxes').min(initialValue?.num_boxes ?? 1, 'Number of boxes can\'t be less than previously set value'),
        header_image: Yup.string().url('Invalid URL format').optional(),
        open_after_a_day: Yup.boolean().optional(),
    });

    type CreateCampaignFormSchema = Yup.InferType<typeof createValidationSchema>;

    const { mutate: createMutate, isPending: isCreatePending } = useCreateCampaign({
        onSuccess() {
            toast.success('Campaign created successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['company-campaigns'] });
            client.invalidateQueries({ queryKey: ['company-box'] });
        },
    });

    const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateCampaign({
        id: initialValue?.id ?? '',
        onSuccess() {
            toast.success('Campaign updated successfully');
            onClose();
            client.invalidateQueries({ queryKey: ['company-campaigns'] });
            client.invalidateQueries({ queryKey: ['company-box'] });
        },
    });

    const initialValues: CreateCampaignFormSchema = {
        name: initialValue?.name ?? '',
        company_boxes: initialValue?.company_boxes.toString() ?? '',
        num_boxes: initialValue?.num_boxes ?? 0,
        header_image: initialValue?.header_image ?? '',
        open_after_a_day: initialValue?.open_after_a_day ?? false
    }

    const handleSubmit = (values: CreateCampaignFormSchema) => {
        if (query === 'update')
            updateMutate({
                name: values.name,
                num_boxes: values.num_boxes,
                header_image: values.header_image,
                open_after_a_day: values.open_after_a_day ?? false,
            });
        else createMutate({
            name: values.name,
            company_boxes: values.company_boxes,
            // duration: values.duration,
            num_boxes: values.num_boxes,
            header_image: values.header_image,
            open_after_a_day: values.open_after_a_day ?? false,
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={query === 'update' ? updateValidationSchema : createValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ isValid, dirty, errors, values, setFieldValue }) => (
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
                        defaultValue={initialValue?.company_boxes ?? 0}
                        handleChange={(value) => setFieldValue('company_boxes', value)}
                        disabled={query === 'update' ? true : false}
                    />

                    {/* <FormikControl
                        type='text'
                        name='duration'
                        label='Campaign duration (days)'
                        placeholder='3'
                        control='input'
                        disabled={query === 'update' ? true : false}
                    /> */}

                    <FormikControl
                        type='text'
                        name='num_boxes'
                        label='Number of boxes'
                        placeholder='10'
                        control='input'
                    />

                    <FormikControl
                        type='text'
                        name='open_after_a_day'
                        label='Open after 24hrs'
                        placeholder=''
                        control='checkbox'
                    />

                    <div className='flex flex-col'>
                        <p className='text-sm'>Header Image</p>
                        <ImageUpload
                            value={values.header_image ? [values.header_image] : []}
                            disabled={isCreatePending || isUpdatePending}
                            onChange={(url) => setFieldValue('header_image', url)}
                            onRemove={() => setFieldValue('header_image', '')}
                        />
                    </div>

                    {/* <div className='w-full'>
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
                                        <Image src={headerImg ?? initialValue?.header_image} width={150} height={150} alt='' />
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
                    </div> */}

                    <Button
                        type='submit'
                        disabled={((!(isValid && dirty)) || isCreatePending || isUpdatePending)}
                        isLoading={isCreatePending || isUpdatePending}
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
