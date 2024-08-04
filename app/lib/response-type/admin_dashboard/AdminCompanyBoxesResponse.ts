interface AdminCompanyBoxResponse {
    id: number
    qty: number
    created_at: string
    updated_at: string
    company: Company
    box_type: BoxType
}
interface Company {
    id: number
    owner: number
    owner_username: string
    name: string
    logo: string
    header_image: string
    company_url: any
    box_limit: number
    socials?: any
    color_schema?: any
    created_at: string
    updated_at: string
}
interface BoxType {
    id: number
    name: string
    label: string
    category: string
    qty: number
    created_at: string
    updated_at: string
}

type AdminCompanyBoxRequest = {
    qty?: number
    company?: number
    box_type?: number
}


