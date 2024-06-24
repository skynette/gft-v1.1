import InputControl from "./InputControl";

interface ControlProps {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    control: string;
    options?: { option: string, value: string }[];
    handleChange?: (key: string) => void;
}

export default function FormikControl({ control, ...rest }: ControlProps) {
    switch (control) {
        case 'input': return <InputControl {...rest} />
        default: return null
    }
}