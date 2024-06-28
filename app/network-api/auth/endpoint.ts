import axiosInstance from "@/lib/axiosInstance";
import { AccountRequest } from "@/lib/response-type/auth/AccountRequest";

export const updateProfile = async (token: string, req: AccountRequest): Promise<AccountRequest> => {
    const response = await axiosInstance.patch(`/auth/user/update/`, {...req}, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}