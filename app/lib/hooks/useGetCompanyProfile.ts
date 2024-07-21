import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getCompanyProfile, regenerateAPIKey, updateCompanyProfile } from '@/network-api/dashboard/endpoint';
import { CompanyProfileResponse } from '../response-type/company_dashboard/CompanyProfileResponse';
import { RegenerateAPIKeyRequest, RegenerateAPIKeyResponse } from '../response-type/company_dashboard/RegenerateAPIKeyRequest';

export default function useGetCompanyProfile() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<CompanyProfileResponse, AxiosError>({
        queryKey: ['company-profile'],
        queryFn: () => getCompanyProfile(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useRegenerateAPIKey({ onSuccess, onError }: { onSuccess?: (data: RegenerateAPIKeyResponse) => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<RegenerateAPIKeyResponse, AxiosError, RegenerateAPIKeyRequest>({
        mutationFn: (req: RegenerateAPIKeyRequest) => regenerateAPIKey(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? '', req),
        onSuccess(data, variables, context) {
            onSuccess?.(data);
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}

export function useUpdateCompanyProfile({ onSuccess, onError }: { onSuccess?: (data: CompanyProfileResponse) => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error, variables } = useMutation<CompanyProfileResponse, AxiosError, CompanyProfileResponse>({
        mutationFn: (req: CompanyProfileResponse) => updateCompanyProfile(session.data?.accessToken ?? '', session.data?.companyAPIKey ?? '', req),
        onSuccess(data, variables, context) {
            onSuccess?.(data);
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error, variables };
}