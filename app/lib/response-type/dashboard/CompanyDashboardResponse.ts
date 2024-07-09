interface CompanyDashboardResponse {
    gifts: Gifts;
    gift_visits: Giftvisits;
    campaigns: Campaigns;
    boxes: Boxes;
}
interface Boxes {
    total_boxes: number;
    boxes_last_month: number;
    boxes_this_month: number;
    boxes_percentage_increase: number;
}
interface Campaigns {
    total_campaigns: number;
    campaigns_last_month: number;
    campaigns_this_month: number;
    campaigns_percentage_increase: number;
}
interface Giftvisits {
    total_gift_visits: number;
    gift_visits_last_month: number;
    gift_visits_this_month: number;
    gift_visits_percentage_increase: number;
}
interface Gifts {
    total_gifts: number;
    gifts_last_month: number;
    gifts_this_month: number;
    gifts_percentage_increase: number;
}