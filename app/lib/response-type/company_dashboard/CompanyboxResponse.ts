export interface CompanyCatboxResponse {
    id: number
    company_name: string
    box_type: BoxType
    qty: number
    created_at: string
    updated_at: string
}

export interface BoxType {
    id: number
    name: string
    label: string
    category: string
    qty: number
    created_at: string
    updated_at: string
}
