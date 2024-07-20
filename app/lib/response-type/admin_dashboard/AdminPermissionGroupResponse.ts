interface AdminPermissionGroupResponse {
    id: number
    permissions: Permission[]
    name: string
    label: string
    description: string
}

interface Permission {
    id: number
    label: string
    description: string
    groups: number[]
}
