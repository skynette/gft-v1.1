export interface AdminDashBoardResponse {
    total_users: number
    total_boxes: number
    total_campaigns: number
    total_gifts: number
    users_percentage_increase: number
    boxes_percentage_increase: number
    campaigns_percentage_increase: number
    gifts_percentage_increase: number
}


export interface AdminDashboardChartResponse {
    users: User[]
    boxes: Box[]
    campaigns: Campaign[]
}

export interface User {
    month: string
    total_users: number
}

export interface Box {
    month: string
    total_boxes: number
}

export interface Campaign {
    month: string
    total_campaigns: number
}
