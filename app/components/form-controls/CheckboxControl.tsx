'use client';

import { ErrorMessage, Field, FieldProps } from 'formik';
import { FC } from 'react';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

interface CheckboxProps {
    name: string;
    label: string;
}

const CheckboxControl: FC<CheckboxProps> = ({ name, label }) => {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className='flex items-center space-x-2'>
                            <Checkbox id={name} checked={props.field.checked} onCheckedChange={(e) => props.form.setFieldValue(name, e.valueOf())} />
                            <Label htmlFor={name} className='font-normal text-sm'>{label}</Label>
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className='text-red-500 text-xs'>{msg}</small>} />
        </div>
    )
}

export default CheckboxControl;