
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getNotificiations } from '@/network-api/dashboard/endpoint';
import { NotificationResponse } from '../response-type/dashboard/NotificationResponse';

export default function useNotifications() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<NotificationResponse[], AxiosError>({
        queryKey: ['notifications'],
        queryFn: () => getNotificiations(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}