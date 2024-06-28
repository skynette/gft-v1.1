import { useQueries, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { DashboardResponse } from '../response-type/dashboard/DashboardResponse';
import { getDashboardMetrics, getGiftReceived, getGiftSent } from '@/network-api/dashboard/endpoint';

export default function useGiftOverview() {
    const session = useSession();

    const { data, pending, success } = useQueries({
        queries: [
            {
                queryKey: ['gift-sent'],
                queryFn: () => getGiftSent(session?.data?.accessToken ?? ''),
                enabled: session.status === 'authenticated',
            },
            {
                queryKey: ['gift-received'],
                queryFn: () => getGiftReceived(session?.data?.accessToken ?? ''),
                enabled: session.status === 'authenticated',
            },
        ],
        combine(results) {
            return {
                data: results.map((result, index) => ({ index, data: result.data })),
                pending: results.some((result) => result.isPending),
                success: results.every((result) => result.isSuccess),
            }
        },
    });

    return { data, pending, success };
}