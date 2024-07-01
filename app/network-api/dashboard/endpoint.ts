import axiosInstance from "@/lib/axiosInstance";
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

export const getNotificiations = async (token: string): Promise<NotificationResponse[]> => {
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