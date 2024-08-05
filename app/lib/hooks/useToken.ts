import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TokenRequest } from '../response-type/auth/TokenRequest';
import { TokenResponse } from '../response-type/auth/TokenResponse';
import { getPhoneToken, getToken } from '@/network-api/auth/endpoint';

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

export function usePhoneToken({ onSuccess, onError }: { onSuccess?: () => void, onError?: () => void }) {
    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<TokenResponse, AxiosError, TokenRequest>({
        mutationFn: ({ mobile }: TokenRequest) => getPhoneToken({ mobile }),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.();
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}