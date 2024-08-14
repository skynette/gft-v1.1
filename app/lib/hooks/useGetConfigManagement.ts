import { getConfigManagement, updateConfigManagement } from '@/network-api/dashboard/endpoint';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

export function useGetConfigManagement() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<ConfigManagementResponse, AxiosError>({
        queryKey: ['config-management'],
        queryFn: () => getConfigManagement(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useUpdateConfigManagement({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<any, AxiosError, UpdateConfigManagementRequest>({
        mutationFn: (req: UpdateConfigManagementRequest) => updateConfigManagement(session.data?.accessToken ?? '', req),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}