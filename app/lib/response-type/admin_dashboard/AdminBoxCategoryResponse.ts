interface AdminBoxCategoryResponse {
    id: string
    name: string
    label: string
    category: string
    qty: number
    created_at: string
    updated_at: string
  }
  

  interface AdminBoxCategoryRequest {
    id?: string
    name: string
    label?: string
    category: string
    qty: number
    created_at?: string
    updated_at?: string
  }
  