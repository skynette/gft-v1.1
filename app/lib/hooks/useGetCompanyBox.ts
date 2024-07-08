import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getCompanyBox } from '@/network-api/dashboard/endpoint';
import { CompanyBoxResponse } from '../response-type/company_dashboard/BoxesRespose';

export default function useGetCompanyBox() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<CompanyBoxResponse, AxiosError>({
        queryKey: ['company-box'],
        queryFn: () => getCompanyBox(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}