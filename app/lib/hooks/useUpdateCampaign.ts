import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { UpdateCampaignRequest } from '../response-type/company_dashboard/CreateCampaignRequest';
import { updateCampaign } from '@/network-api/dashboard/endpoint';

export default function useUpdateCampaign({ id, onSuccess, onError }: { id: string, onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();


    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<any, AxiosError, UpdateCampaignRequest>({
        mutationFn: (req: UpdateCampaignRequest) => updateCampaign(id, session.data?.accessToken ?? '', session.data?.companyAPIKey ?? '', req),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}