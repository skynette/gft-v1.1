'use client';

import { signIn, useSession, signOut } from 'next-auth/react';

export default function Dashboard() {
    const { data: session, status } = useSession();
    console.log({ session })

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (session) {
        return <p>Welcome, {session.user?.email}. Your token is {session.accessToken} <button onClick={() => signOut()}>signOut</button></p>;
    }

    return (
        <div>
            <p>You are not logged in.</p>
            <button onClick={() => signIn('google')}>Sign in with Google</button>
        </div>
    );
}
