import axiosInstance from "@/lib/axiosInstance";
import { BoxSetupResponse } from "@/lib/response-type/gifter/BoxSetupResponse";

export const getGiftBox = async (id: string, token: string): Promise<BoxSetupResponse> => {
    const response = await axiosInstance.get(`/dashboard/gifter/gift-boxes/${id}/setup/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}