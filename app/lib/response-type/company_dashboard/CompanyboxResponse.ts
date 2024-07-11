export interface CompanyCatboxResponse {
    id: number;
    company_name: string;
    box_type: Boxtype;
    qty: number;
    created_at: string;
    updated_at: string;
}
interface Boxtype {
    id: number;
    name: string;
    label: string;
    category: string;
    qty: number;
    created_at: string;
    updated_at: string;
}