'use client';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
    return (
        <button onClick={() => signOut()} className='hover:cursor-pointer'>
            Log out
        </button>
    );
}
