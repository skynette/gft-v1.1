interface AdminNotificationsResponse {
    id: number
    message: string
    read: boolean
    timestamp: string
    created_at: string
    updated_at: string
    user: number
    box: number
    gift: number
}


interface AdminNotificationsRequest {
    id?: number
    message?: string
    read?: boolean
    timestamp?: string
    created_at?: string
    updated_at?: string
    user?: number
    box?: number
    gift?: number
}
