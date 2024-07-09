export interface CreateBoxRequest {
    title?: string
    receiver_name?: string
    receiver_email?: string
    receiver_phone?: string
    open_date?: Date
    last_opened?: Date
    is_setup?: boolean
    is_company_setup?: boolean
    open_after_a_day?: boolean
    box_category?: number
}