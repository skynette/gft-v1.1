import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { BoxSetupResponse } from '../response-type/gifter/BoxSetupResponse';
import { getGiftBox } from '@/network-api/gifter/endpoint';
import { useSession } from 'next-auth/react';

export default function useGetGiftbox(boxId: string) {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<BoxSetupResponse, AxiosError>({
        queryKey: ['box', boxId],
        queryFn: () => getGiftBox(boxId, session.data?.accessToken ?? '')
    });

    return { data, isPending, isSuccess, isError, error };
}