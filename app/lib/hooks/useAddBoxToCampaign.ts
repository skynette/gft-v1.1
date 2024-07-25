import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { addBoxToCampaign } from '@/network-api/dashboard/endpoint';

export default function useAddBoxToCampaign({ id, onSuccess, onError }: { id: string, onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<any, AxiosError, string[]>({
        mutationFn: (boxIds: string[]) => addBoxToCampaign(id, session.data?.accessToken ?? '', session.data?.companyAPIKey ?? '', boxIds),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}