import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getAdminDashboardChart, getAdminDashboardMetrics } from '@/network-api/dashboard/endpoint';
import { AdminDashBoardResponse, AdminDashboardChartResponse } from '../response-type/dashboard/AdminDashboardResponse';

export default function useAdminDashboardMetrics() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminDashBoardResponse, AxiosError>({
        queryKey: ['admin-dashboard-metrics'],
        queryFn: () => getAdminDashboardMetrics(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated',
        staleTime: 10000000
    });

    return { data, isPending, isSuccess, isError, error };
}


export function useAdminDashboardChartData() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminDashboardChartResponse, AxiosError>({
        queryKey: ['admin-dashboard-charts'],
        queryFn: () => getAdminDashboardChart(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated',
        staleTime: 10000000
    });

    return { data, isPending, isSuccess, isError, error };
}

