interface AdminGiftResponse {
  pkid: number
  id: string
  created_at: string
  updated_at: string
  gift_title: string
  gift_description: string
  gift_content_type: string
  reaction: any
  opened: boolean
  open_date: string
  user: any
  box_model: number
  gift_campaign: number
}

interface AdminGiftRequest {
  id?: string
  gift_title?: string
  gift_description?: string
  gift_content_type?: string
  reaction?: any
  opened?: boolean
  open_date?: string
  user?: number
  box_model?: number
  gift_campaign?: number
}