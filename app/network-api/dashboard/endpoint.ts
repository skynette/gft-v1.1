import axiosInstance from "@/lib/axiosInstance";
import { CompanyBoxResponse } from "@/lib/response-type/company_dashboard/BoxesRespose";
import { CompanyCatboxResponse } from "@/lib/response-type/company_dashboard/CompanyboxResponse";
import { CreateBoxRequest } from "@/lib/response-type/company_dashboard/CreateBoxRequest";
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