'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRightCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import FormikControl from '@/components/form-controls/FormikControl';
import useToken from '@/lib/hooks/useToken';
import { toast } from 'sonner';
import useVerifyToken from '@/lib/hooks/useVerifyToken';

interface UserInput {
    email: string
}

interface OTPToken {
    otp: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('This email is invalid').required('Enter your email address'),
});

const otpTokenValidationSchema = Yup.object().shape({
    otp: Yup.string().min(6, 'Your one-time password must be 6 characters.')
});

export default function Login() {
    const [emailInitialValue, setEmailInitialValue] = useState<UserInput>({ email: '' });
    const [token] = useState<OTPToken>({ otp: '' });
    const [stage, setStage] = useState<'request' | 'verify'>('verify');
    const router = useRouter();

    const { mutate: mutateToken, isPending, isSuccess } = useToken({
        onSuccess() {
            setStage('verify');
            toast.success('A new token has been sent to your email.');
        }
    });

    const { mutate: mutateVerifyToken } = useVerifyToken({
        onSuccess() {
            toast.success('Email has been verified successfully!');
        },
        onError() {
            toast.error('Unable to verify email');
        },
    })

    const handleRequestToken = async (email: string) => {
        mutateToken({ email });
        setEmailInitialValue({ email })
    };

    const handleSignIn = async (token: string) => {

        const result = await signIn('credentials', {
            redirect: false,
            email: emailInitialValue.email,
            token,
        });
        console.log("RESULT FROM NEXT AUTH", { result })
        if (result?.error) {
            console.error('Error signing in:', result.error);
            if (result.error.includes("token")) {
                toast.error("Invalid or expired token. A new token has been sent to your email.");
                await handleRequestToken(emailInitialValue.email); // Resend token
            } else {
                toast.error('Failed to sign in. Please try again.');
            }
        } else {
            // Handle successful login
            toast.success('Successfully signed in');
            console.log('Successfully signed in');
            router.push('/');
        }
    };

    const handleGoogleSignIn = async () => {
        signIn('google', { callbackUrl: '/' });
    };

    const handleAppleSignIn = async () => {
        signIn('apple', { callbackUrl: '/' });
    };

    return (
        <div className='container h-screen grid grid-cols-[2fr_1.5fr]'>
            <div className='flex flex-col items-center bg-blue-500 py-10'>
                <Image src='/asset-1.png' width={200} height={200} alt='' />
                <p className='mt-4 text-white font-bold text-4xl tracking-wider'>GFT</p>
                <p className='text-white tracking-wide font-semibold text-2xl'>Redefining the <span className='underline underline-offset-1 italic'>gift giving experience!</span></p>
                <p className='inline-flex items-center text-white mt-5'>
                    Sign in to get started!
                    <ArrowRightCircle size={40} strokeWidth={1} className='ml-2' />
                </p>
            </div>

            {stage === 'request' ?
                <div className='w-full flex flex-col justify-center items-center py-10 px-16'>
                    <h1 className='font-bold text-4xl tracking-wider mt-10'>GFT</h1>
                    <p className='text-gray-700 font-medium text-lg tracking-wide mt-5'>Sign in to continue!</p>
                    <Formik
                        initialValues={emailInitialValue}
                        onSubmit={(field) => {
                            handleRequestToken(field.email);
                        }}
                        validationSchema={validationSchema}
                        className="flex flex-col w-full mt-10 space-y-1">
                        {
                            () => (
                                <Form className='w-full'>
                                    <FormikControl
                                        type='email'
                                        name='email'
                                        label='Email address'
                                        placeholder='user@test.com'
                                        control='input' />

                                    <Button type='submit' className='w-full !mt-8 text-white'>Continue</Button>
                                </Form>
                            )
                        }

                    </Formik>

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
                    <div className='w-full flex flex-col justify-center items-center py-10 px-16'>
                        <h1 className='font-bold text-4xl tracking-wider mt-10'>GFT</h1>
                        <p className='text-gray-700 text-center font-medium text-lg tracking-wide mt-5'>Please check <span className='text-blue-500'>{emailInitialValue.email}</span> for the token sent!</p>
                        <Formik
                            initialValues={token}
                            validationSchema={otpTokenValidationSchema}
                            onSubmit={(field) => handleSignIn(field.otp)}
                            className="flex flex-col items-center w-full mt-10 space-y-1">
                            {
                                ({ setFieldValue, errors }) => (
                                    <Form className='w-full flex flex-col items-center'>
                                        <Field name='otp'>
                                            {
                                                () => (
                                                    <>
                                                        <InputOTP onChange={(e) => setFieldValue('otp', e)} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={0} />
                                                                <InputOTPSlot index={1} />
                                                                <InputOTPSlot index={2} />
                                                                <InputOTPSlot index={3} />
                                                                <InputOTPSlot index={4} />
                                                                <InputOTPSlot index={5} />
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                        <ErrorMessage name='otp' render={msg => <p>{errors.otp}</p>} />
                                                    </>
                                                )
                                            }

                                        </Field>
                                        <p className='text-gray-600 text-xs'>Enter your one-time password.</p>
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
