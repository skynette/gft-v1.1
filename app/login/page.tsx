'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [stage, setStage] = useState<'request' | 'verify'>('request');
    const router = useRouter();

    const handleRequestToken = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${email}`,
            });
            setStage('verify');
            toast.success('A new token has been sent to your email.');
        } catch (error) {
            console.error('Error requesting token:', error);
            toast.error('Failed to request a token. Please try again.');
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            redirect: false,
            email,
            token,
        });
        console.log("RESULT FROM NEXT AUTH", { result })
        if (result?.error) {
            console.error('Error signing in:', result.error);
            if (result.error.includes("token")) {
                toast.error("Invalid or expired token. A new token has been sent to your email.");
                await handleRequestToken(e); // Resend token
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-700">Sign In</h2>
                <div>
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <FcGoogle className="w-5 h-5 mr-2" />
                        Sign in with Google
                    </button>
                </div>
                <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>
                {stage === 'request' ? (
                    <form onSubmit={handleRequestToken} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Request Token
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div>
                            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                                Token
                            </label>
                            <div className="mt-1">
                                <input
                                    id="token"
                                    name="token"
                                    type="text"
                                    required
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
