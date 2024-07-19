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
    const response = await axiosInstance.put(`/dashboard/boxes/${id}/update/`, req, {
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

export const getAdminCompanies = async (token: string): Promise<AdminCompanyResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/companies/', {
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

export const getAdminCompanyAPIKeys = async (token: string): Promise<AdminCompanyAPIKeyResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/company-boxes-api-key/', {
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

export const getAdminGiftVisits = async (token: string): Promise<AdminGiftVisitsResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/giftvisits/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminPermissions = async (token: string): Promise<AdminPermissionsResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/permission/', {
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

export const getAdminTemplates = async (token: string): Promise<AdminTemplatesResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/template/', {
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