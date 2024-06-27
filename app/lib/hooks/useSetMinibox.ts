import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { setMinibox } from '@/network-api/gifter/endpoint';
import { useSession } from 'next-auth/react';
import { MiniboxRequest } from '../response-type/gifter/MiniboxRequest';

export default function useSetMiniBox({ boxId, onSuccess, onError }: { boxId: string, onSuccess?: () => void, onError?: () => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<any, AxiosError, MiniboxRequest[]>({
        mutationFn: (req: MiniboxRequest[]) => setMinibox(boxId, session.data?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.();
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}