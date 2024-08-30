import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import axiosInstance from "@/lib/axiosInstance";

export function useGetCompanyCampaignById(id?: string) {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error, refetch } = useQuery<CampaignResponse, AxiosError>({
        queryKey: ['company-campaigns'],
        queryFn: () => getCompanyCampaignById(session.data?.accessToken ?? '', id),
        enabled: !!id
    });

    return { data, isPending, isSuccess, isError, error, refetch };
}

export const getCompanyCampaignById = async (token: string, id?: string): Promise<CampaignResponse> => {
    const response = await axiosInstance.get(`/dashboard/campaigns/${id}/detail/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}
