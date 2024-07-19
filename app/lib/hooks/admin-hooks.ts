import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { getAdminBoxCategories, getAdminBoxes, getAdminCampaigns, getAdminCompanies, getAdminCompanyAPIKeys, getAdminCompanyBoxes, getAdminGiftVisits, getAdminGifts } from '@/network-api/admin/endpoint';

export function useGetAdminCampaigns() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminCampaignResponse[], AxiosError>({
        queryKey: ['admin-campaigns'],
        queryFn: () => getAdminCampaigns(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminBoxes() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminBoxResponse[], AxiosError>({
        queryKey: ['admin-box'],
        queryFn: () => getAdminBoxes(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminBoxCategories() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminBoxCategoryResponse[], AxiosError>({
        queryKey: ['admin-box-categories'],
        queryFn: () => getAdminBoxCategories(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminCompanies() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminCompanyResponse[], AxiosError>({
        queryKey: ['admin-box-companies'],
        queryFn: () => getAdminCompanies(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminCompanyBoxes() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminCompanyBoxResponse[], AxiosError>({
        queryKey: ['admin-company-boxes'],
        queryFn: () => getAdminCompanyBoxes(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminCompanyAPIKeys() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminCompanyAPIKeyResponse[], AxiosError>({
        queryKey: ['admin-company-api-keys'],
        queryFn: () => getAdminCompanyAPIKeys(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminGifts() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminGiftResponse[], AxiosError>({
        queryKey: ['admin-gifts'],
        queryFn: () => getAdminGifts(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminGiftVisits() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminGiftVisitsResponse[], AxiosError>({
        queryKey: ['admin-giftvisits'],
        queryFn: () => getAdminGiftVisits(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}
