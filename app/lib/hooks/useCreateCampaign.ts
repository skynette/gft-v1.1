import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { CreateCampaignRequest } from '../response-type/company_dashboard/CreateCampaignRequest';
import { createCampaign } from '@/network-api/dashboard/endpoint';

export default function useCreateCampaign({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<any, AxiosError, CreateCampaignRequest>({
        mutationFn: (req: CreateCampaignRequest) => createCampaign(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? '', req),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}