export interface CreateCampaignRequest {
    name: string
    company_boxes: string
    duration: number
    num_boxes: number
    header_image: any
    open_after_a_day: boolean
}

export type UpdateCampaignRequest = Omit<CreateCampaignRequest, 'company_boxes' | 'duration'>;