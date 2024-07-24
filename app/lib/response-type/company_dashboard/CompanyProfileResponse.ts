export interface CompanyProfileResponse {
    id?: number
    name: string
    logo: any
    header_image: any
    company_url: string
    box_limit: number
    socials: Socials
    color_schema: ColorSchema
  }
  
  export interface Socials {
    twitter_url: string
    youtube_url: string
    facebook_url: string
    snapchat_url: string
    instagram_url: string
  }
  
  export interface ColorSchema {
    dark: Dark
    light: Light
  }
  
  export interface Dark {
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
  
  export interface Light {
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
  