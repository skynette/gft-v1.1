'use client';

import CheckboxControl from "./CheckboxControl";
import DatePickerControl from "./DatePickerControl";
import InputControl from "./InputControl";
import InputTextarea from "./InputTextArea";
import PhoneInputControl from "./PhoneInputControl";
import SelectControl from "./SelectControl";

interface ControlProps {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    control: string;
    disabled?: boolean;
    defaultValue?: string;
    options?: { option: string, value: string }[];
    handleChange?: (key: string) => void;
}

export default function FormikControl({ control, ...rest }: ControlProps) {
    switch (control) {
        case 'input': return <InputControl {...rest} />
        case 'phone-input': return <PhoneInputControl {...rest} />
        case 'date-picker': return <DatePickerControl {...rest} />
        case 'checkbox': return <CheckboxControl {...rest} />
        case 'textarea': return <InputTextarea {...rest} />
        case 'select': return <SelectControl {...rest} />
        default: return null
    }
}