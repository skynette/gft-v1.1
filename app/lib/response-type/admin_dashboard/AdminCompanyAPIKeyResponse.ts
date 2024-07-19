interface AdminCompanyAPIKeyResponse {
    id: number
    company_name: string
    groups: string[]
    key: string
    num_of_requests_made: number
    max_requests: number
    created_at: string
    last_used: string
    company: number
}
