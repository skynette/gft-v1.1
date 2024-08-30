import axiosInstance from "@/lib/axiosInstance";
import { BoxSetupRequest } from "@/lib/response-type/gifter/BoxSetupRequest";
import { BoxSetupResponse } from "@/lib/response-type/gifter/BoxSetupResponse";
import { MiniboxRequest } from "@/lib/response-type/gifter/MiniboxRequest";
import { MiniboxResponse } from "@/lib/response-type/gifter/MiniboxResponse";

export const getGiftBox = async (id: string, token: string): Promise<BoxSetupResponse> => {
    const response = await axiosInstance.get(`/dashboard/gifter/gift-boxes/${id}/setup/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export const setGifterBox = async (token: string, boxId: string, req: BoxSetupRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/gifter/gift-boxes/${boxId}/setup/`, { ...req }, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export const getMinibox = async (id: string, token: string): Promise<MiniboxResponse[]> => {
    const response = await axiosInstance.get(`/dashboard/gifter/gift-boxes/${id}/gifts/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export const setMinibox = async (id: string, token: string, req: MiniboxRequest[]): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/gifter/gift-boxes/${id}/gifts/setup/`, req, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export const editGiftBox = async (boxId: string, token: string, req: BoxSetupRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/gifter/gift-boxes/${boxId}/edit/`, { ...req }, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}