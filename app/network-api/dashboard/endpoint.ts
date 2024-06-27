import axiosInstance from "@/lib/axiosInstance";
import { DashboardResponse } from "@/lib/response-type/dashboard/DashboardResponse";

export const getDashboardMetrics = async (token: string): Promise<DashboardResponse> => {
    const response = await axiosInstance.get('/dashboard/gifter/dashboard/metrics/', {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}