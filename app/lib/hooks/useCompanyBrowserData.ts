import { getCompanyBrowserUsage } from '@/network-api/dashboard/endpoint';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

export function useCompanyBrowserUsage() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<BrowserUsageResponse, AxiosError>({
        queryKey: ['company-browser-usage'],
        queryFn: () => getCompanyBrowserUsage(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated',
        staleTime: 10000000
    });

    return { data, isPending, isSuccess, isError, error };
}