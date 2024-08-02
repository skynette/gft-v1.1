import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { adminDeleteBox, adminDeleteBoxCategories, adminDeleteCampaign, adminDeleteCompany, adminDeleteCompanyAPIKey, adminDeleteCompanyBoxes, adminDeleteGift, adminDeleteGiftVisit, adminDeletePermission, adminDeletePermissionGroup, adminDeleteTemplate, adminDeleteToken, adminSetActiveTemplate, getAdminBoxCategories, getAdminBoxes, getAdminCampaigns, getAdminCompanies, getAdminCompanyAPIKeys, getAdminCompanyBoxes, getAdminCompanyUsers, getAdminConfig, getAdminGiftVisits, getAdminGifts, getAdminPermissionGroups, getAdminPermissions, getAdminRoles, getAdminTemplates, getAdminTokens, getAdminUsers } from '@/network-api/admin/endpoint';

export function useGetAdminCampaigns() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminCampaignResponse[], AxiosError>({
        queryKey: ['admin-campaigns'],
        queryFn: () => getAdminCampaigns(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useAdminDeleteCampaign({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteCampaign(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
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

export function useAdminDeleteBox({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteBox(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
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

export function useAdminDeleteBoxCategories({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteBoxCategories(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
}

export function useGetAdminCompanies() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminCompanyResponse[], AxiosError>({
        queryKey: ['admin-companies'],
        queryFn: () => getAdminCompanies(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminUsers() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminUserResponse[], AxiosError>({
        queryKey: ['admin-users'],
        queryFn: () => getAdminUsers(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminCompanyUsers() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminUserResponse[], AxiosError>({
        queryKey: ['admin-users'],
        queryFn: () => getAdminCompanyUsers(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}


export function useAdminDeleteCompany({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteCompany(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
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

export function useAdminDeleteCompanyBoxes({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteCompanyBoxes(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
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

export function useAdminDeleteCompanyAPIKey({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteCompanyAPIKey(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
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

export function useAdminDeleteGift({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteGift(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
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

export function useAdminDeleteGiftVisit({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteGiftVisit(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
}

export function useGetAdminPermissions() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminPermissionsResponse[], AxiosError>({
        queryKey: ['admin-permission'],
        queryFn: () => getAdminPermissions(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useAdminDeletePermission({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeletePermission(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
}

export function useGetAdminPermissionGroups() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminPermissionGroupResponse[], AxiosError>({
        queryKey: ['admin-permission-group'],
        queryFn: () => getAdminPermissionGroups(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useAdminDeletePermissionGroup({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeletePermissionGroup(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
}

export function useGetAdminTemplates() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminTemplatesResponse[], AxiosError>({
        queryKey: ['admin-templates'],
        queryFn: () => getAdminTemplates(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useAdminDeleteTemplate({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteTemplate(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
}


export function useAdminSetActiveTemplate({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();
    console.log({ session })

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminSetActiveTemplate(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
}

export function useGetAdminConfig() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminConfigResponse, AxiosError>({
        queryKey: ['admin-config'],
        queryFn: () => getAdminConfig(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useGetAdminRoles() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminRolesResponse, AxiosError>({
        queryKey: ['admin-roles'],
        queryFn: () => getAdminRoles(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}


export function useGetAdminTokens() {
    const session = useSession();

    const { data, isPending, isSuccess, isError, error } = useQuery<AdminTokensResponse, AxiosError>({
        queryKey: ['admin-tokens'],
        queryFn: () => getAdminTokens(session.data?.accessToken ?? ''),
        enabled: session.status === 'authenticated'
    });

    return { data, isPending, isSuccess, isError, error };
}

export function useAdminDeleteToken({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: AxiosError) => void }) {
    const session = useSession();

    const { mutate, data, isPending, isSuccess, isError, error } = useMutation<any, AxiosError, string>({
        mutationFn: (id: string) => adminDeleteToken(session.data?.accessToken ?? '', id),
        onSuccess(data, variables, context) {
            onSuccess?.();
        },
        onError(error, variables, context) {
            onError?.(error);
        },
    });

    return { mutate, data, isPending, isSuccess, isError, error };
}
