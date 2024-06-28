export interface GiftOverviewResponse {
    user: number
    owner: string
    days_of_gifting: string
    box_campaign: number
    box_campaign_deleted_status: boolean
    id: string
    created_at: string
    updated_at: string
    title: string
    receiver_name: string
    receiver_email: any
    receiver_phone: string
    open_date: string
    last_opened: any
    is_setup: boolean
    is_company_setup: boolean
    open_after_a_day: boolean
}