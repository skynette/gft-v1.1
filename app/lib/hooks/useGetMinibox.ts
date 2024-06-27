import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMinibox } from '@/network-api/gifter/endpoint';
import { useSession } from 'next-auth/react';
import { MiniboxResponse } from '../response-type/gifter/MiniboxResponse';

export default function useGetMinibox(boxId: string) {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<MiniboxResponse[], AxiosError>({
        queryKey: ['minibox', boxId],
        queryFn: () => getMinibox(boxId, session.data?.accessToken ?? '')
    });

    return { data, isPending, isSuccess, isError, error };
}