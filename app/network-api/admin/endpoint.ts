import axiosInstance from "@/lib/axiosInstance";

export const adminCreateBox = async (token: string, req: AdminBoxRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/boxes/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateBox = async (id: string, token: string, req: AdminBoxRequest): Promise<any> => {
    console.log("admin update box called with id:", id)
    const response = await axiosInstance.put(`/dashboard/admin/boxes/${id}/update/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteBox = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/boxes/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteCampaign = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/campaigns/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateBoxCategory = async (token: string, req: AdminBoxCategoryRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/box-category/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminUpdateBoxCategory = async (id: string, token: string, req: AdminBoxCategoryRequest): Promise<any> => {
    console.log("admin update box called with id:", id)
    const response = await axiosInstance.put(`/dashboard/admin/box-category/update/${id}/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteBoxCategories = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/box-category/delete/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteCompany = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/companies/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteCompanyBoxes = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/company-boxes/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteCompanyAPIKey = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/company-api-key/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteGift = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/gifts/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminNotifications = async (token: string): Promise<AdminNotificationsResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/notifications/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateNotiication = async (token: string, req: AdminNotificationsRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/notifications/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminUpdateNotification = async (id: string, token: string, req: AdminNotificationsRequest): Promise<any> => {
    console.log("admin update box called with id:", id)
    const response = await axiosInstance.put(`/dashboard/admin/notifications/${id}/update/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteNotification = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/notifications/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteGiftVisit = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/giftvisits/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeletePermission = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/permissions/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeletePermissionGroup = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/permission-groups/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteTemplate = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/template/delete/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const getAdminBoxes = async (token: string): Promise<AdminBoxResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/boxes/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminBoxCategories = async (token: string): Promise<AdminBoxCategoryResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/box-category/list/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminCampaigns = async (token: string): Promise<AdminCampaignResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/campaigns/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateCampaign = async (token: string, req: AdminCampaignRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/campaigns/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateCampaign = async (id: string, token: string, req: AdminCampaignRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/campaigns/${id}/update/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminUsers = async (token: string): Promise<AdminUserResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/users/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateUsers = async (token: string, req: AdminUserRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/users/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateUsers = async (id: string, token: string, req: AdminUserRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/users/${id}/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteUsers = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/users/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const getAdminCompanyUsers = async (token: string): Promise<AdminUserResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/users/?user_type=company', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminCompanies = async (token: string): Promise<AdminCompanyResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/companies/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateCompany = async (token: string, req: AdminCompanyRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/companies/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateCompany = async (id: string, token: string, req: AdminCompanyRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/companies/${id}/update/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const getAdminCompanyBoxes = async (token: string): Promise<AdminCompanyBoxResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/company-boxes/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateCompanyBox = async (token: string, req: AdminCompanyBoxRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/company-boxes/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateCompanyBox = async (id: string, token: string, req: AdminCompanyBoxRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/company-boxes/${id}/update/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const getAdminCompanyAPIKeys = async (token: string): Promise<AdminCompanyAPIKeyResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/company-api-key/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateAPIKey = async (token: string, req: AdminCompanyAPIKeyRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/company-api-key/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateAPIkey = async (id: string, token: string, req: AdminCompanyAPIKeyRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/company-api-key/${id}/update/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const getAdminGifts = async (token: string): Promise<AdminGiftResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/gifts/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateGifts = async (token: string, req: AdminGiftRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/gifts/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateGifts = async (id: string, token: string, req: AdminGiftRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/gifts/${id}/update/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminGiftVisits = async (token: string): Promise<AdminGiftVisitsResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/giftvisits/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateGiftVisits = async (token: string, req: AdminGiftVisitsRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/giftvisits/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateGiftVisits = async (id: string, token: string, req: AdminGiftVisitsRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/giftsvisits/${id}/update/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}
export const getAdminPermissions = async (token: string): Promise<AdminPermissionsResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/permissions/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminPermissionGroups = async (token: string): Promise<AdminPermissionGroupResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/permission-groups/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminPermissionGroupsItems = async (token: string, id: string): Promise<AdminPermissionGroupResponse> => {
    const response = await axiosInstance.get(`/dashboard/admin/permission-groups/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminUpdatePermissionGroups = async (token: string, id: string, ids: string[]): Promise<AdminPermissionGroupResponse> => {
    console.log(ids);
    const response = await axiosInstance.post(`/dashboard/admin/roles/${id}/`, {
        "selected_permissions": ids
    }, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminTemplates = async (token: string): Promise<AdminTemplatesResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/template/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminCreateTemplate = async (token: string, req: AdminTemplatesRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/admin/template/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const adminUpdateTemplate = async (id: string, token: string, req: AdminTemplatesRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/template/update/${id}/`, req, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminSetActiveTemplate = async (token: string, id: string): Promise<any> => {
    console.log("token is")
    const response = await axiosInstance.put(`/dashboard/admin/template/setactive/${id}/`, {}, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminConfig = async (token: string): Promise<AdminConfigResponse> => {
    const response = await axiosInstance.get('/dashboard/admin/config-management/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminRoles = async (token: string): Promise<AdminRolesResponse> => {
    const response = await axiosInstance.get('/dashboard/admin/roles/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminTokens = async (token: string): Promise<AdminTokensResponse> => {
    const response = await axiosInstance.get('/dashboard/admin/api-tokens/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const adminDeleteToken = async (token: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/admin/api-tokens/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}
