export interface CompanyUserResponse {
    id: number
    user: User
    company: string
    created_at: string
    updated_at: string
  }
  
  export interface User {
    username: string
    first_name: any
    last_name: any
    email: string
    contact_preference: string
    mobile: string
    is_active: boolean
    user_type: string
    date_joined: string
    image: string
  }
  