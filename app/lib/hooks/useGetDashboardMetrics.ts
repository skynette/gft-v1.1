import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { DashboardResponse } from '../response-type/dashboard/DashboardResponse';
import { getDashboardMetrics } from '@/network-api/dashboard/endpoint';

export default function useGetDashboardMetrics() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<DashboardResponse, AxiosError>({
        queryKey: ['dashboard-metrics'],
        queryFn: () => getDashboardMetrics(session.data?.accessToken ?? '')
    });

    return { data, isPending, isSuccess, isError, error };
}