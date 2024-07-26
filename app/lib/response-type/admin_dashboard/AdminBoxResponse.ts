interface AdminBoxResponse {
    pkid: number
    user: User
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
    qr_code_v: any
    open_after_a_day: boolean
    box_campaign: number
}

interface User {
    username: string
    first_name: any
    last_name: any
    email: string
    mobile: string
    id: string
}


interface AdminBoxRequest {
    title: string
    receiver_name: string
    receiver_email: string
    receiver_phone: string
    days_of_gifting: number
    open_date: string
    last_opened?: string
    is_setup: boolean
    is_company_setup: boolean
    open_after_a_day: boolean
    user: string
    box_campaign: number
}
