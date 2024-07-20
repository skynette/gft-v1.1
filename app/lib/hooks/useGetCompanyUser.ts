import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getCompanyUsers } from '@/network-api/dashboard/endpoint';
import { CompanyUserResponse } from '../response-type/company_dashboard/CompanyUserResponse';

export default function useGetCompanyUsers() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<CompanyUserResponse[], AxiosError>({
        queryKey: ['company-users'],
        queryFn: () => getCompanyUsers(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}