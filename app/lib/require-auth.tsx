// lib/withAuth.tsx

import { useEffect, ComponentType } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

interface AuthProps {
    session: Session;
}

const requireAuth = <P extends AuthProps>(WrappedComponent: ComponentType<P>) => {
    const AuthenticatedComponent = (props: Omit<P, keyof AuthProps>) => {
        const { data: session, status } = useSession();
        console.log({ session })
        const router = useRouter();

        useEffect(() => {
            if (status === 'unauthenticated') {
                router.push('/login');
            }
        }, [status, router]);

        if (status === 'loading') {
            return <p>Loading...</p>;
        }

        if (status === 'authenticated') {
            return <WrappedComponent {...(props as P)} session={session} />;
        }

        return null;
    };

    return AuthenticatedComponent;
};

export default requireAuth;
