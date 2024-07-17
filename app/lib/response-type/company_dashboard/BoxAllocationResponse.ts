export type BoxAllocationResponse = BoxAllocation[]

export interface BoxAllocation {
  id: string
  company_name: string
  box_type: BoxType
  qty: number
  created_at: string
  updated_at: string
}

export interface BoxType {
  id: string
  name: string
  label: string
  category: string
  qty: number
  created_at: string
  updated_at: string
}
