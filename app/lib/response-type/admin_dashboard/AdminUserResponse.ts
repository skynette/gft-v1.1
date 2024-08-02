type AdminUserResponse = {
    pkid: number
    last_login: any
    is_superuser: boolean
    is_staff: boolean
    is_active: boolean
    date_joined: string
    id: string
    created_at: string
    updated_at: string
    first_name: string
    last_name: string
    username: string
    email: string
    mobile: string
    contact_preference: string
    image: string
    provider: string
    user_type: string
    groups: any[]
    user_permissions: any[]
}

type AdminUserRequest = {
    pkid: number
    last_login: any
    is_superuser: boolean
    is_staff: boolean
    is_active: boolean
    date_joined: string
    id: string
    created_at: string
    updated_at: string
    first_name: string
    last_name: string
    username: string
    email: string
    mobile: string
    contact_preference: string
    image: string
    provider: string
    user_type: string
    groups: any[]
    user_permissions: any[]
}