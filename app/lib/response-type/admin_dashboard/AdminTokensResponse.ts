interface AdminTokensResponse {
    count: number
    next: string
    previous: any
    results: TokenResponse[]
}

interface TokenResponse {
    key: string
    user: TUser
    created: string
}

interface TUser {
    username: string
    first_name: string
    last_name: string
    email: string
    mobile: string
    id: string
}