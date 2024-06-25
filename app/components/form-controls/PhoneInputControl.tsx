'use client';

import { ErrorMessage, Field, FieldProps } from 'formik';
import { FC } from 'react';
import { Label } from '../ui/label';
import { PhoneInput } from '../ui/phone-input';

interface PhoneInputProps {
    name: string;
    label: string;
    type: string;
    placeholder: string;
}

const PhoneInputControl: FC<PhoneInputProps> = ({ name, label, type, placeholder }) => {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className='flex flex-col space-y-2'>
                            <Label htmlFor={name} className='font-normal text-sm'>{label}</Label>
                            <PhoneInput type={type} className='rounded-lg w-full text-sm bg-white'
                                id={name} placeholder={placeholder} onChange={(e) => props.form.setFieldValue(name, e)} />
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className='text-red-500 text-xs'>{msg}</small>} />
        </div>
    )
}

export default PhoneInputControl;