import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getCompanyCategoryBox } from '@/network-api/dashboard/endpoint';
import { CompanyCatboxResponse } from '../response-type/company_dashboard/CompanyboxResponse';

export default function useGetCompanyCategorybox() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<CompanyCatboxResponse[], AxiosError>({
        queryKey: ['company-cat-box'],
        queryFn: () => getCompanyCategoryBox(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}