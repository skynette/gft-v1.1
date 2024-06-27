import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { BoxSetupRequest } from '../response-type/gifter/BoxSetupRequest';
import { setGifterBox } from '@/network-api/gifter/endpoint';
import { useSession } from 'next-auth/react';

export default function useSetGifterBox({ boxId, onSuccess, onError }: { boxId: string, onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<any, AxiosError, BoxSetupRequest>({
        mutationFn: (req: BoxSetupRequest) => setGifterBox(session.data?.accessToken ?? '', boxId, req),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}