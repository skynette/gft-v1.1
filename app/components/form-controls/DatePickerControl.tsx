import { ErrorMessage, Field, FieldProps } from 'formik';
import { FC } from 'react';
import { Label } from '../ui/label';
import { DatePicker } from '../ui/date-picker';

interface DatePickerProps {
    name: string;
    label: string;
}

const DatePickerControl: FC<DatePickerProps> = ({ name, label }) => {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className='flex flex-col space-y-2'>
                            <Label htmlFor={name} className='font-normal text-sm'>{label}</Label>
                            <DatePicker date={props.field.value} onChange={(e) => props.form.setFieldValue(name, e)} />
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className='text-red-500 text-xs'>{msg}</small>} />
        </div>
    )
}

export default DatePickerControl;