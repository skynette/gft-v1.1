import { UseMutationResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMinibox } from '@/network-api/gifter/endpoint';
import { useSession } from 'next-auth/react';
import { MiniboxResponse } from '../response-type/gifter/MiniboxResponse';
import { recordGiftVisit } from '@/network-api/dashboard/endpoint';
import { toast } from 'sonner';

export default function useGetMinibox(boxId: string) {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<MiniboxResponse[], AxiosError>({
        queryKey: ['minibox', boxId],
        queryFn: () => getMinibox(boxId, session.data?.accessToken ?? '')
    });

    return { data, isPending, isSuccess, isError, error };
}



export const useRecordGiftVisit = (): UseMutationResult<any, AxiosError, GiftVisitRequest> => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation<any, AxiosError, GiftVisitRequest>({
        mutationFn: (req: GiftVisitRequest) =>
            recordGiftVisit(session?.accessToken ?? '', req),
        onSuccess: (data, variables, context) => {
            // toast.success('Gift visit recorded successfully');
            queryClient.invalidateQueries({ queryKey: ['gift-visits'] });
        },
        onError: (error) => {
            // toast.error('Failed to record gift visit');
            console.error('Error recording gift visit:', error);
        },
    });
};