interface CompanyChartResponse {
    boxes: Box[];
    campaigns: Campaign[];
}
interface Campaign {
    month: string;
    total_campaigns: number;
}
interface Box {
    month: string;
    total_boxes: number;
}