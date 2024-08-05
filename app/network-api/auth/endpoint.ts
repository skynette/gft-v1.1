import axiosInstance from "@/lib/axiosInstance";
import { AccountRequest } from "@/lib/response-type/auth/AccountRequest";
import { ProfileResponse } from "@/lib/response-type/auth/ProfileResponse";
import { TokenRequest } from "@/lib/response-type/auth/TokenRequest";
import { TokenResponse } from "@/lib/response-type/auth/TokenResponse";
import { VerifyTokenRequest } from "@/lib/response-type/auth/VerifyTokenRequest";

export const getToken = async (req: TokenRequest): Promise<TokenResponse> => {
    const response = await axiosInstance.post('/auth/email/', { ...req });
    return response.data;
}


export const getPhoneToken = async (req: TokenRequest): Promise<TokenResponse> => {
    console.log("calling phone token api with ", req)
    const response = await axiosInstance.post('/auth/token/phone/', { ...req });
    return response.data;
}


export const verifyToken = async (req: VerifyTokenRequest): Promise<any> => {
    const response = await axiosInstance.post('/auth/email/', { ...req });
    return response.data;
}

export const getProfile = async (token: string): Promise<ProfileResponse> => {
    const response = await axiosInstance.get('/auth/user/detail', {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export const updateProfile = async (token: string, req: AccountRequest): Promise<AccountRequest> => {
    const formData = new FormData();
    formData.append('first_name', req.first_name);
    formData.append('last_name', req.last_name);
    formData.append('username', req.username);
    formData.append('mobile', req.mobile);
    formData.append('contact_preference', req.contact_preference ?? '');
    formData.append('image', req.image ?? '');

    const response = await axiosInstance.patch(`/auth/user/update/`, formData, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}