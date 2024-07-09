import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getCompanyCampaigns } from '@/network-api/dashboard/endpoint';

export default function useGetCompanyCampaign() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<CampaignResponse[], AxiosError>({
        queryKey: ['company-campaigns'],
        queryFn: () => getCompanyCampaigns(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}