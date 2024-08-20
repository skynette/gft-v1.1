'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRightCircle, Loader } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { OTPInput, REGEXP_ONLY_DIGITS } from 'input-otp';
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import FormikControl from '@/components/form-controls/FormikControl';
import useToken, { usePhoneToken } from '@/lib/hooks/useToken';
import { toast } from 'sonner';

interface UserInput {
    email?: string
    mobile?: string
}

interface OTPInput {
    otp: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('This email is invalid').optional(),
    mobile: Yup.string().optional(),
});

const otpTokenValidationSchema = Yup.object().shape({
    otp: Yup.string().required('Please enter your otp').length(6, 'Your one-time pin must be 6 characters.')
});

export default function Login() {
    const [emailInitialValue, setEmailInitialValue] = useState<UserInput>({ email: '' });
    const [mobileInitialValue, setMobileInitialValue] = useState<UserInput>({ mobile: '' });

    const [method, setMethod] = useState<'email' | 'mobile'>('email');

    const otpInitialValue: OTPInput = { otp: '' };

    const [stage, setStage] = useState<'request' | 'verify'>('request');

    const router = useRouter();

    const { mutate: mutateToken, isPending, isSuccess } = useToken({
        onSuccess() {
            setStage('verify');
            toast.success('A new token has been sent to your email.');
        },
        onError() {
            setStage('request');
            toast.error("Failed to send OTP, retry")
        },
    });

    const { mutate: mutatePhoneToken, isPending: phoneLoading, isSuccess: phoneSuccess } = usePhoneToken({
        onSuccess() {
            setStage('verify');
            toast.success('A new token has been sent to your phone.');
        },
        onError() {
            setStage('request');
            toast.error("Failed to send OTP, retry")
        },
    });

    const handleRequestToken = async (input: UserInput) => {
        if (method === "email") {
            mutateToken(input);
            setEmailInitialValue(input);
        } else {
            mutatePhoneToken(input)
            setMobileInitialValue(input);
        }
    };

    const handleSignIn = async (token: string) => {
        const result = await signIn('credentials', {
            redirect: false,
            email: emailInitialValue.email,
            mobile: mobileInitialValue.mobile,
            token,
        });
        if (result?.error) {
            console.error('Error signing in:', result.error);
            if (result.error.includes("token")) {
                toast.error("Invalid or expired token. A new token has been sent to your email or phone.");
                if (method === "mobile") {
                    await handleRequestToken(mobileInitialValue);
                } else {
                    await handleRequestToken(emailInitialValue); // Resend token
                }
            } else {
                toast.error('Failed to sign in. Please try again.');
            }
        } else {
            // Handle successful login
            toast.success('Successfully signed in');
            router.push('/dashboard');
        }
    };

    const handleGoogleSignIn = async () => {
        signIn('google', { callbackUrl: '/dashboard/gifter' });
    };

    const handleAppleSignIn = async () => {
        signIn('apple', { callbackUrl: '/dashboard/gifter' });
    };

    const toggleMethod = () => {
        setMethod(prev => prev === 'email' ? 'mobile' : 'email');
    };

    return (
        <div className='md:6xl:container h-screen md:grid grid-cols-[2fr_1.5fr]'>
            <div className='hidden md:flex flex-col justify-center items-center bg-blue-500 py-10'>
                <Image unoptimized src='/images/asset-1.png' width={200} height={200} alt='' />
                <p className='mt-4 text-white font-bold text-4xl tracking-wider'>GFT</p>
                <p className='text-white tracking-wide font-semibold text-2xl'>Redefining the <span className='underline underline-offset-1 italic'>gifting experience!</span></p>
                <p className='inline-flex items-center text-white mt-5'>
                    Sign in to get started!
                    <ArrowRightCircle size={40} strokeWidth={1} className='ml-2' />
                </p>
            </div>

            {stage === 'request' ?
                <div className='w-full bg-gray-100 h-screen flex flex-col justify-center items-center py-10 px-16'>
                    <h1 className='font-bold text-4xl tracking-wider mt-10'>GFT</h1>
                    <p className='text-gray-700 font-medium text-lg tracking-wide mt-5'>Sign in to continue!</p>
                    <Formik
                        initialValues={emailInitialValue}
                        onSubmit={(field) => {
                            handleRequestToken(field);
                        }}
                        validationSchema={validationSchema}>
                        {
                            () => (
                                <Form className='w-full flex flex-col mt-10 space-y-1'>
                                    {method === 'email' ? (
                                        <FormikControl
                                            type='email'
                                            name='email'
                                            label='Email address'
                                            placeholder='user@test.com'
                                            control='input' />
                                    ) : (
                                        <FormikControl
                                            type='text'
                                            name='mobile'
                                            label='Phone Number'
                                            placeholder='+123xxxxxxxxxx'
                                            control='phone-input' />
                                    )}

                                    <Button type='submit' disabled={isPending} className='flex items-center w-full !mt-8 text-white'>
                                        {isPending && <Loader className='h-5 w-5 mr-2 animate-spin' />}
                                        <p>Continue</p>
                                    </Button>
                                </Form>
                            )
                        }
                    </Formik>

                    <Button variant='link' onClick={toggleMethod} className='mt-4'>
                        {method === 'email' ? 'Sign in with mobile number' : 'Sign in with email'}
                    </Button>

                    <p className='uppercase text-gray-600 text-sm font-semibold my-8'>or</p>

                    <div className='w-full flex flex-col space-y-3'>
                        <Button variant='outline' className='items-center' onClick={handleGoogleSignIn}>
                            <FcGoogle className="w-5 h-5 mr-2" />
                            Sign in with Google
                        </Button>

                        <Button variant='outline' className='bg-black text-white items-center' onClick={handleAppleSignIn}>
                            <FaApple className="w-5 h-5 mr-2" />
                            Sign in with Apple
                        </Button>
                    </div>
                </div>
                :
                (
                    <div className='w-full bg-gray-100 flex flex-col justify-center items-center py-10 px-16'>
                        <h1 className='font-bold text-4xl tracking-wider mt-10'>GFT</h1>
                        <p className='text-gray-700 text-center font-medium text-lg tracking-wide mt-5'>Please check <span className='text-blue-500'>{emailInitialValue.email || emailInitialValue.mobile}</span> for the token sent!</p>
                        <Formik
                            initialValues={otpInitialValue}
                            validationSchema={otpTokenValidationSchema}
                            onSubmit={(field) => handleSignIn(field.otp)}>
                            {
                                () => (
                                    <Form className='w-full flex flex-col items-center mt-10 space-y-1 '>
                                        <Field name='otp'>
                                            {
                                                ({ form }: FieldProps) => (
                                                    <InputOTP onChange={e => form.setFieldValue('otp', e)} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0} />
                                                            <InputOTPSlot index={1} />
                                                            <InputOTPSlot index={2} />
                                                            <InputOTPSlot index={3} />
                                                            <InputOTPSlot index={4} />
                                                            <InputOTPSlot index={5} />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                )
                                            }
                                        </Field>

                                        <p className='text-gray-600 text-xs mt-4'>Enter your one-time password.</p>
                                        <ErrorMessage name='otp' render={msg => <p className='text-xs text-red-500'>{msg}</p>} />
                                        <Button type='submit' className='w-full !mt-8 text-white'>Continue</Button>
                                    </Form>
                                )
                            }
                        </Formik>
                    </div>
                )
            }
        </div>
    )
}
