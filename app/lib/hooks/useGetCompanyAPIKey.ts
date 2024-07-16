import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getCompanyAPIKey } from '@/network-api/dashboard/endpoint';
import { CompanyAPIKeyResponse } from '../response-type/company_dashboard/CompanyAPIKeyResponse';

export default function useGetCompanyAPIKey() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<CompanyAPIKeyResponse, AxiosError>({
        queryKey: ['company-users'],
        queryFn: () => getCompanyAPIKey(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}