import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getGiftReceived } from '@/network-api/dashboard/endpoint';
import { GiftOverviewResponse } from '../response-type/dashboard/GiftOverResponse';

export default function useGetGiftsReceived() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<GiftOverviewResponse[], AxiosError>({
        queryKey: ['gift-received'],
        queryFn: () => getGiftReceived(session?.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated',

    });

    return { data, isPending, isSuccess, isError, error };
}