import axiosInstance from "@/lib/axiosInstance";
import { BoxAllocationResponse } from "@/lib/response-type/company_dashboard/BoxAllocationResponse";
import { CompanyBoxResponse } from "@/lib/response-type/company_dashboard/BoxesRespose";
import { CompanyAPIKeyResponse } from "@/lib/response-type/company_dashboard/CompanyAPIKeyResponse";
import { CompanyProfileResponse } from "@/lib/response-type/company_dashboard/CompanyProfileResponse";
import { CompanyUserResponse } from "@/lib/response-type/company_dashboard/CompanyUserResponse";
import { CompanyCatboxResponse } from "@/lib/response-type/company_dashboard/CompanyboxResponse";
import { CreateBoxRequest } from "@/lib/response-type/company_dashboard/CreateBoxRequest";
import { CreateCampaignRequest, UpdateCampaignRequest } from "@/lib/response-type/company_dashboard/CreateCampaignRequest";
import { RegenerateAPIKeyRequest } from "@/lib/response-type/company_dashboard/RegenerateAPIKeyRequest";
import { DashboardResponse } from "@/lib/response-type/dashboard/DashboardResponse";
import { GiftOverviewResponse } from "@/lib/response-type/dashboard/GiftOverResponse";
import { NotificationResponse } from "@/lib/response-type/dashboard/NotificationResponse";

export const getDashboardMetrics = async (token: string): Promise<DashboardResponse> => {
    const response = await axiosInstance.get('/dashboard/gifter/dashboard/metrics/', {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export const getGiftSent = async (token: string): Promise<GiftOverviewResponse[]> => {
    const response = await axiosInstance.get('/dashboard/gifter/gift-boxes/sent/', {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}


export const getGiftReceived = async (token: string): Promise<GiftOverviewResponse[]> => {
    const response = await axiosInstance.get('/dashboard/gifter/gift-boxes/received/', {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export const getNotifications = async (token: string): Promise<NotificationResponse[]> => {
    const response = await axiosInstance.get('/dashboard/gifter/notifications/', {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export const markNotificationAsRead = async (token: string, notificationId: string): Promise<any> => {
    const response = await axiosInstance.get(`/dashboard/gifter/notifications/${notificationId}/mark-read/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

// COMPANY ENDPOINT
export const getCompanyDashboardMetrics = async (token: string, apiKey: string): Promise<CompanyDashboardResponse> => {
    const response = await axiosInstance.get('/dashboard/analytics/combined/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const getCompanyChartData = async (token: string, apiKey: string): Promise<CompanyChartResponse> => {
    const response = await axiosInstance.get('/dashboard/analytics/charts/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const getCompanyBox = async (token: string, apiKey: string): Promise<CompanyBoxResponse> => {
    const response = await axiosInstance.get('/dashboard/boxes/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const getBoxAllocation = async (token: string, apiKey: string): Promise<BoxAllocationResponse> => {
    const response = await axiosInstance.get('/dashboard/company-boxes/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const getCompanyProfile = async (token: string, apiKey: string): Promise<CompanyProfileResponse> => {
    const response = await axiosInstance.get('/dashboard/company/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const regenerateAPIKey = async (token: string, apiKey: string, req: RegenerateAPIKeyRequest): Promise<any> => {
    const formData = new FormData();
    formData.append('api_key', req.api_key);

    const response = await axiosInstance.post(`/dashboard/api-key/regenerate/`, formData, {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const deleteBox = async (token: string, apiKey: string, id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/dashboard/boxes/${id}/delete/`, {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const getCompanyCampaigns = async (token: string, apiKey: string): Promise<CampaignResponse[]> => {
    const response = await axiosInstance.get('/dashboard/campaigns/all/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const getCompanyUsers = async (token: string, apiKey: string): Promise<CompanyUserResponse[]> => {
    const response = await axiosInstance.get('/dashboard/company-users/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const getCompanyAPIKey = async (token: string, apiKey: string): Promise<CompanyAPIKeyResponse> => {
    const response = await axiosInstance.get('/dashboard/api-key-usage/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const getCompanyCategoryBox = async (token: string, apiKey: string): Promise<CompanyCatboxResponse[]> => {
    const response = await axiosInstance.get('/dashboard/company-boxes/', {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const createBox = async (token: string, apiKey: string, req: CreateBoxRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/boxes/create/', req, {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const updateBox = async (id: string, token: string, apiKey: string, req: CreateBoxRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/boxes/${id}/edit/`, req, {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
        }
    });
    return response.data;
}

export const createCampaign = async (token: string, apiKey: string, req: CreateCampaignRequest): Promise<any> => {
    const formData = new FormData();
    formData.append('name', req.name);
    formData.append('company_boxes', req.company_boxes);
    formData.append('duration', req.duration.toString());
    formData.append('num_boxes', req.num_boxes.toString());
    formData.append('header_image', req.header_image);
    formData.append('open_after_a_day', req.open_after_a_day.toString());

    const response = await axiosInstance.post('/dashboard/campaigns/create/', formData, {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const updateCampaign = async (id: string, token: string, apiKey: string, req: UpdateCampaignRequest): Promise<any> => {
    const formData = new FormData();
    formData.append('name', req.name);
    formData.append('num_boxes', req.num_boxes.toString());
    formData.append('open_after_a_day', req.open_after_a_day.toString());

    if (typeof req.header_image === 'object')
        formData.append('header_image', req.header_image);

    const response = await axiosInstance.put(`/dashboard/campaigns/${id}/update/`, formData, {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}