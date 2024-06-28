'use client';

import { ErrorMessage, Field, FieldProps } from 'formik';
import { nanoid } from 'nanoid';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SelectProps {
    name: string;
    label: string;
    placeholder?: string;
    options?: { option: string, value: string }[];
    handleChange?: (key: string) => void;
}

function SelectControl({ name, label, placeholder, options, handleChange }: SelectProps) {
    return (
        <div className='w-full'>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className='w-full flex flex-col space-y-1'>
                            <Label htmlFor={name} className='text-gray-700 text-sm'>{label}</Label>
                            <Select onValueChange={(value) => {
                                props.form.setFieldValue(name, value);
                                if (handleChange)
                                    handleChange(value);
                            }}>
                                <SelectTrigger className='w-full focus-visible:ring-offset-0 focus-visible:ring-2'>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        options?.map((item) => (
                                            <SelectItem key={nanoid()} id={name} value={item.value} className='text-sm'>
                                                {item.option}
                                            </SelectItem>)
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className='text-red-500 text-xs'>{msg}</small>} />
        </div>
    )
}

export default SelectControl;