import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { deleteBox} from '@/network-api/dashboard/endpoint';

export default function useDeleteBox({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => deleteBox(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
}