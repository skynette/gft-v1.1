import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getProfile } from '@/network-api/auth/endpoint';
import { ProfileResponse } from '../response-type/auth/ProfileResponse';

export default function useGetProfile() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<ProfileResponse, AxiosError>({
        queryKey: ['profile'],
        queryFn: () => getProfile(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated',
    });

    return { data, isPending, isSuccess, isError, error };
}