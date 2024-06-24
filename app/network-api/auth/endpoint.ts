import axiosInstance from "@/lib/axiosInstance";
import { TokenRequest } from "@/lib/response-type/auth/TokenRequest";
import { TokenResponse } from "@/lib/response-type/auth/TokenResponse";
import { VerifyTokenRequest } from "@/lib/response-type/auth/VerifyTokenRequest";

export const getToken = async (req: TokenRequest): Promise<TokenResponse> => {
    const response = await axiosInstance.post('/auth/email/', { ...req });
    return response.data;
}

export const verifyToken = async (req: VerifyTokenRequest): Promise<VerifyTokenRequest> => {
    const response = await axiosInstance.post('/auth/email/', { ...req });
    return response.data;
}