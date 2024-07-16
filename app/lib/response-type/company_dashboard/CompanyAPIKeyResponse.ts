export interface CompanyAPIKeyResponse {
    metrics: Metrics
    results: Result[]
}

export interface Metrics {
    total_requests: number
}

export interface Result {
    id: number
    company: string
    status: string
    key: string
    num_of_requests_made: number
    max_requests: number
    created_at: string
    last_used: string
    groups: number[]
}
