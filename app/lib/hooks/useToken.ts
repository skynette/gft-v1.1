import { useMutation } from '@tanstack/react-query';
import { getToken } from '@/network-api/account/endpoint';
import { AxiosError } from 'axios';
import { TokenRequest } from '../response-type/auth/TokenRequest';
import { TokenResponse } from '../response-type/auth/TokenResponse';

export default function useToken({ onSuccess, onError }: { onSuccess?: () => void, onError?: () => void }) {
    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<TokenResponse, AxiosError, TokenRequest>({
        mutationFn: ({ email }: TokenRequest) => getToken({ email }),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.();
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}