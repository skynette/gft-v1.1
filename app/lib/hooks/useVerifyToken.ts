import { useMutation } from '@tanstack/react-query';
import { verifyToken } from '@/network-api/auth/endpoint';
import { AxiosError } from 'axios';
import { VerifyTokenRequest } from '../response-type/auth/VerifyTokenRequest';

export default function useVerifyToken({ onSuccess, onError }: { onSuccess?: () => void, onError?: () => void }) {
    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<VerifyTokenResponse, AxiosError, VerifyTokenRequest>({
        mutationFn: ({ email, token, mobile }: VerifyTokenRequest) => verifyToken({ email, token, mobile }),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.();
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}