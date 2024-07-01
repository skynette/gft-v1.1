export interface NotificationResponse {
    id: number
    user: User
    box: Box
    gift: Gift
    message: string
    read: boolean
    timestamp: string
    created_at: string
    updated_at: string
}

export interface User {
    username: string
    first_name: string
    last_name: string
    email: string
    contact_preference: string
    mobile: string
    is_active: boolean
    user_type: string
    date_joined: string
    image: any
}

export interface Box {
    owner: string
    id: string
    created_at: string
    updated_at: string
    title: string
    receiver_name: string
    receiver_email: string
    receiver_phone: any
    days_of_gifting: number
    open_date: string
    last_opened: any
    is_setup: boolean
    is_company_setup: boolean
    box_campaign: number
}

export interface Gift {
    pkid: number
    box_model: BoxModel
    total_visits: number
    gifter: string
    gift_campaign_deleted_status: boolean
    id: string
    gift_title: string
    gift_description: string
    gift_content_type: string
    reaction: any
    opened: boolean
    open_date: string
    user: any
    gift_campaign: number
}

export interface BoxModel {
    owner: string
    id: string
    created_at: string
    updated_at: string
    title: string
    receiver_name: string
    receiver_email: string
    receiver_phone: string
    days_of_gifting: number
    open_date: string
    last_opened: any
    is_setup: boolean
    is_company_setup: boolean
    box_campaign: number
}
