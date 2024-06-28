import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { AccountRequest } from '../response-type/auth/AccountRequest';
import { updateProfile } from '@/network-api/auth/endpoint';

export default function useUpdateUser({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<any, AxiosError, AccountRequest>({
        mutationFn: (req: AccountRequest) => updateProfile(session.data?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}