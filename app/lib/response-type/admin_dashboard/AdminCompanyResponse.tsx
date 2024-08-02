interface AdminCompanyResponse {
  id: number
  owner: number
  owner_username: string
  name: string
  logo: string
  header_image: string
  company_url: string
  box_limit: number
  socials: Socials
  color_schema: ColorSchema
  created_at: string
  updated_at: string
}

interface Socials {
  twitter_url: string
  youtube_url: string
  facebook_url: string
  snapchat_url: string
  instagram_url: string
}

interface ColorSchema {
  dark: Dark
  light: Light
}

interface Dark {
  footer_color: string
  header_color: string
  primary_color: string
  secondary_color: string
  background_color: string
  foreground_color: string
  qr_code_text_color: string
  background_hover_color: string
  background_border_color: string
}

interface Light {
  footer_color: string
  header_color: string
  primary_color: string
  secondary_color: string
  background_color: string
  foreground_color: string
  qr_code_text_color: string
  background_hover_color: string
  background_border_color: string
}

type AdminCompanyRequest = {
  id?: number
  owner?: number
  owner_username?: string
  name?: string
  logo?: string
  header_image?: string
  company_url?: string
  box_limit?: number
  socials?: Socials
  color_schema?: ColorSchema
  created_at?: string
  updated_at?: string
}
