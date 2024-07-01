import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { markNotificationAsRead } from '@/network-api/dashboard/endpoint';

export default function useMarkNotificationAsRead({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<any, AxiosError, string>({
        mutationFn: (notificationId: string) => markNotificationAsRead(session.data?.accessToken ?? '', notificationId),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}