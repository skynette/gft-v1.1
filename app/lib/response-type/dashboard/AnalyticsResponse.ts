export interface AnalyticsResponse {
    gifts: Gifts
    gift_visits: GiftVisits
    campaigns: Campaigns
}

export interface Gifts {
    total_gifts: number
    gifts_last_month: number
    gifts_this_month: number
    gifts_percentage_increase: number
}

export interface GiftVisits {
    total_gift_visits: number
    gift_visits_last_month: number
    gift_visits_this_month: number
    gift_visits_percentage_increase: number
}

export interface Campaigns {
    total_campaigns: number
    campaigns_last_month: number
    campaigns_this_month: number
    campaigns_percentage_increase: number
}
