interface AdminCampaignResponse {
  pkid: number
  id: string
  company_name: string
  name: string
  box_type: string
  duration: number
  num_boxes: number
  header_image: string
  open_after_a_day: boolean
  company_boxes?: string
}


interface AdminCampaignRequest {
  company_boxes?: string
  name?: string
  box_type?: string
  duration?: number
  num_boxes?: number
  header_image?: string
  open_after_a_day?: boolean
}
