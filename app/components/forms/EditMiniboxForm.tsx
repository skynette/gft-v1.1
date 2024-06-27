'use client';

import { Field, FieldArray, FieldProps, Form, Formik, getIn } from "formik";
import * as Yup from 'yup';
import FormikControl from "../form-controls/FormikControl";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { GiftBoxValues } from "@/(routes)/dashboard/(gifter_dashboard)/gifter/gift-boxes/[box_id]/setup/page";
import useGetGiftbox from "@/lib/hooks/useGetGiftbox";
import { useParams } from "next/navigation";
import { Separator } from "../ui/separator";
import { nanoid } from "nanoid";
import React from "react";
import useSetMiniBox from "@/lib/hooks/useSetMinibox";

const ErrorMessage = ({ name }: { name: string }) => (
    <Field
        name={name}
        render={({ form }: FieldProps) => {
            const error = getIn(form.errors, name);
            return error ? <p className="text-red-500 text-xs !mt-1">{error}</p> : null;
        }}
    />
);

const EditMiniboxForm = ({ onPrev, onNext, data, isPending }: {
    onPrev: (data: GiftBoxValues) => void,
    onNext: (data: GiftBoxValues, final: boolean) => void,
    data: GiftBoxValues, isPending: boolean
}) => {

    const handleSubmit = (data: GiftBoxValues) => { onNext(data, true) }

    const boxId = useParams().box_id;
    const { data: giftBox } = useGetGiftbox(boxId);

    return (
        <Formik
            initialValues={data}
            validationSchema={Yup.object({
                miniboxes: Yup.array().of(Yup.object({
                    title: Yup.string().required('Enter the title').min(5, 'Title must be at least 10 characters'),
                    desc: Yup.string().required('Enter the title').min(10, 'Description must be at least 10 characters'),
                    openDate: Yup.date().required('Enter the open date'),
                })).required('Must contain mini gift boxes').min(Number(giftBox?.days_of_gifting), `Minimum of ${Number(giftBox?.days_of_gifting)} gift box(es) to be provided`)
            })}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {
                ({ values, errors }) => {
                    return (
                        <Form className="w-full bg-gray-50 max-w-xl flex flex-col space-y-5 shadow-md rounded-lg p-8 mt-[5%]">
                            <FieldArray
                                name="miniboxes"
                                render={arrayHelpers => {
                                    return (
                                        <div>
                                            {
                                                Array.from({ length: Number(giftBox?.days_of_gifting) ?? 0 }).map((_, index) => (
                                                    <div key={index}>
                                                        <div className="flex flex-col space-y-3 my-2">
                                                            <p className="font-medium text-xl">Enter gift for day <span className="text-blue-500 font-bold">{index + 1}</span></p>
                                                            <FormikControl
                                                                type='text'
                                                                name={`miniboxes.${index}.title`}
                                                                label='Title'
                                                                placeholder='Title of the gift box'
                                                                control='input'
                                                            />

                                                            <FormikControl
                                                                type='text'
                                                                name={`miniboxes.${index}.desc`}
                                                                label='Description'
                                                                placeholder='Description of gift box'
                                                                control='textarea'
                                                            />

                                                            <FormikControl
                                                                type='text'
                                                                name={`miniboxes.${index}.openDate`}
                                                                label='Open date'
                                                                placeholder=''
                                                                control='date-picker'
                                                            />
                                                            <ErrorMessage name={`miniboxes.${index}.openDate`} />
                                                        </div>

                                                        {index < Number(giftBox?.days_of_gifting) - 1 && <Separator className="bg-blue-400/50 my-6" orientation="horizontal" />}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }}>
                            </FieldArray>
                            {typeof errors.miniboxes === 'string' && <p className="!mt-1 text-red-500 text-sm">{errors.miniboxes}</p>}

                            <div className="flex space-x-2">
                                <Button variant='outline' className="inline-flex items-center"
                                    onClick={() => onPrev(values)}><ArrowLeft size={18} className="mr-2" /> Back</Button>
                                <Button type='submit'
                                    disabled={isPending}
                                    isLoading={isPending}>Submit</Button>
                            </div>
                        </Form>
                    )
                }
            }
        </Formik>

    )

}

export default EditMiniboxForm;