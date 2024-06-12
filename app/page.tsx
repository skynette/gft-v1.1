'use client';

import requireAuth from './lib/require-auth';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface DashboardProps {
    session: Session;
}

function Dashboard({ session }: DashboardProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-700">Dashboard</h1>
                <div className="flex flex-col items-center space-y-4">
                    {session.user?.image && (
                        <img
                            src={session.user.image}
                            alt="User Profile"
                            className="w-24 h-24 rounded-full shadow-md"
                        />
                    )}
                    <p className="text-xl text-gray-700">Welcome, {session.user?.name}</p>
                    <p className="text-center text-gray-500">Your token is {session.accessToken}</p>
                </div>
                <button
                    onClick={() => signOut()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Sign Out
                </button>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="bg-indigo-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-indigo-700">Feature 1</h2>
                        <p className="text-indigo-600">Description of feature 1.</p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-green-700">Feature 2</h2>
                        <p className="text-green-600">Description of feature 2.</p>
                    </div>
                    <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-yellow-700">Feature 3</h2>
                        <p className="text-yellow-600">Description of feature 3.</p>
                    </div>
                    <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-blue-700">Feature 4</h2>
                        <p className="text-blue-600">Description of feature 4.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default requireAuth(Dashboard);
