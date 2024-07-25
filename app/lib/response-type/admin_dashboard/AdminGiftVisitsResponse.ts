interface AdminGiftVisitsResponse {
    id: number
    time_of_visit: string
    metadata: {}
    created_at: string
    updated_at: string
    gift: Gift
    visitor: Visitor
}

interface Gift {
    pkid: number
    id: string
    created_at: string
    updated_at: string
    gift_title: string
    gift_description: string
    gift_content_type: string
    reaction: any
    opened: boolean
    open_date: string
    user: any
    box_model: number
    gift_campaign: number
}

interface Visitor {
    username: string
    first_name: string
    last_name: string
    email: string
    mobile: string
    id: string
}
