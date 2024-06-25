'use client';

import { ErrorMessage, Field, FieldProps } from 'formik';
import { FC } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface InputProps {
    name: string;
    label: string;
    type: string;
    placeholder: string;
}

const InputControl: FC<InputProps> = ({ name, label, type, placeholder }) => {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className='flex flex-col space-y-2'>
                            <Label htmlFor={name} className='font-normal text-sm'>{label}</Label>
                            <Input type={type} className='rounded-lg w-full text-sm bg-white'
                                id={name} placeholder={placeholder} {...props.field} />
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className='text-red-500 text-xs'>{msg}</small>} />
        </div>
    )
}

export default InputControl;