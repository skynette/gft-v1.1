import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getAdminBoxes, getAdminCampaigns } from '@/network-api/admin/endpoint';

export function useGetAdminCampaigns() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminCampaignResponse[], AxiosError>({
        queryKey: ['admin-campaigns'],
        queryFn: () => getAdminCampaigns(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminBoxes() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminBoxResponse[], AxiosError>({
        queryKey: ['admin-box'],
        queryFn: () => getAdminBoxes(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}