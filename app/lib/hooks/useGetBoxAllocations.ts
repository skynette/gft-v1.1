import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getBoxAllocation } from '@/network-api/dashboard/endpoint';
import { BoxAllocationResponse } from '../response-type/company_dashboard/BoxAllocationResponse';

export default function useGetBoxAllocations() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<BoxAllocationResponse, AxiosError>({
        queryKey: ['box-allocations'],
        queryFn: () => getBoxAllocation(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}