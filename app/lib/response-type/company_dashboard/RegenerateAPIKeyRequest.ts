export interface RegenerateAPIKeyRequest {
    api_key: string
}

export interface RegenerateAPIKeyResponse {
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
  