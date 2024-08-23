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
import { AdminDashBoardResponse, AdminDashboardChartResponse } from "@/lib/response-type/dashboard/AdminDashboardResponse";
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


export const recordGiftVisit = async (token: string, req: GiftVisitRequest): Promise<any> => {
    const response = await axiosInstance.post('/dashboard/gifter/gift-visits/', req, {
      headers: {
        Authorization: `Token ${token}`,
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

// export const updateCompanyProfile = async (token: string, apiKey: string, req: CompanyProfileResponse): Promise<any> => {
//     const formData = new FormData();

//     formData.append('name', req.name);
//     formData.append('logo', req.logo);
//     formData.append('header_image', req.header_image);
//     formData.append('company_url', req.company_url);

//     // Append social media URLs
//     for (const [key, value] of Object.entries(req.socials)) {
//         formData.append(`socials[${key}]`, value as string);
//     }

//     // Append color schema
//     for (const [schemaType, colors] of Object.entries(req.color_schema)) {
//         for (const [colorType, colorValue] of Object.entries(colors as Record<string, string>)) {
//             formData.append(`color_schema[${schemaType}][${colorType}]`, colorValue as string);
//         }
//     }

//     const response = await axiosInstance.put(`/dashboard/settings/update/`, formData, {
//         headers: {
//             Authorization: `Token ${token}`,
//             'gft-api-key': `${apiKey}`,
//             'Content-Type': 'multipart/form-data'
//         }
//     });

//     return response.data;
// }

export const updateCompanyProfile = async (token: string, apiKey: string, req: CompanyProfileResponse): Promise<any> => {
    const data = {
        name: req.name,
        logo: req.logo,
        header_image: req.header_image,
        company_url: req.company_url,
        socials: {
            twitter_url: req.socials.twitter_url,
            facebook_url: req.socials.facebook_url,
            instagram_url: req.socials.instagram_url,
            snapchat_url: req.socials.snapchat_url,
            youtube_url: req.socials.youtube_url
        },
        color_schema: {
            light: {
                primary_color: req.color_schema.light.primary_color,
                secondary_color: req.color_schema.light.secondary_color,
                background_color: req.color_schema.light.background_color,
                qr_code_text_color: req.color_schema.light.qr_code_text_color,
                background_border_color: req.color_schema.light.background_border_color,
                background_hover_color: req.color_schema.light.background_hover_color,
                foreground_color: req.color_schema.light.foreground_color,
                header_color: req.color_schema.light.header_color,
                footer_color: req.color_schema.light.footer_color
            },
            dark: {
                primary_color: req.color_schema.dark.primary_color,
                secondary_color: req.color_schema.dark.secondary_color,
                background_color: req.color_schema.dark.background_color,
                qr_code_text_color: req.color_schema.dark.qr_code_text_color,
                background_border_color: req.color_schema.dark.background_border_color,
                background_hover_color: req.color_schema.dark.background_hover_color,
                foreground_color: req.color_schema.dark.foreground_color,
                header_color: req.color_schema.dark.header_color,
                footer_color: req.color_schema.dark.footer_color
            }
        }
    };

    const response = await axiosInstance.put('/dashboard/settings/update/', data, {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
            'Content-Type': 'application/json'
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

export const getConfigManagement = async (token: string): Promise<ConfigManagementResponse> => {
    const response = await axiosInstance.get('/dashboard/admin/config-management/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}


export const updateConfigManagement = async (token: string, req: UpdateConfigManagementRequest): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/admin/config-management/`, req, {
        headers: {
            Authorization: `Token ${token}`,
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

export const addBoxToCampaign = async (id: string, token: string, apiKey: string, boxIds: string[]): Promise<any> => {
    console.log(boxIds)
    const response = await axiosInstance.post(`/dashboard/campaigns/${id}/add-box-to-campaign/`, {
       'box_ids': boxIds
    }, {
        headers: {
            Authorization: `Token ${token}`,
            'gft-api-key': `${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

// ADMIN ENPOINTS
export const getAdminDashboardMetrics = async (token: string): Promise<AdminDashBoardResponse> => {
    const response = await axiosInstance.get('/dashboard/admin/metrics/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}

export const getAdminDashboardChart = async (token: string): Promise<AdminDashboardChartResponse> => {
    const response = await axiosInstance.get('/dashboard/admin/metrics/charts/', {
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
}