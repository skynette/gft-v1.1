
interface CompanyCampaignResponse {
    detail: string;
    campaign: CampaignResponse;
}

interface CampaignResponse {
    id: string;
    company: number;
    name: string;
    company_boxes: number;
    duration: number;
    num_boxes: number;
    header_image: string;
    open_after_a_day: boolean;
}
