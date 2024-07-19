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

export const getAdminCampaigns = async (token: string): Promise<AdminCampaignResponse[]> => {
    const response = await axiosInstance.get('/dashboard/admin/campaigns/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}
