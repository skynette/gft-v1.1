import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getCompanyChartData, getCompanyDashboardMetrics } from '@/network-api/dashboard/endpoint';

export default function useCompanyDashboardMetrics() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<CompanyDashboardResponse, AxiosError>({
        queryKey: ['company-dashboard-metrics'],
        queryFn: () => getCompanyDashboardMetrics(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated',
        staleTime: 10000000
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useCompanyChartData() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<CompanyChartResponse, AxiosError>({
        queryKey: ['company-dashboard-chart'],
        queryFn: () => getCompanyChartData(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated',
        staleTime: 10000000
    });

    return { data, isPending, isSuccess, isError, error };
}