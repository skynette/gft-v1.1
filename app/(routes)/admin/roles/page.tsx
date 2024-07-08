"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function Component() {
    const [availablePermissions, setAvailablePermissions] = useState([
        { id: 1, name: "View Dashboard", category: "Admin" },
        { id: 2, name: "Manage Users", category: "Admin" },
        { id: 3, name: "Edit Content", category: "Editor" },
        { id: 4, name: "Access Reports", category: "Editor" },
        { id: 5, name: "Manage Settings", category: "Admin" },
        { id: 6, name: "Invite Collaborators", category: "Editor" },
        { id: 7, name: "Delete Projects", category: "Admin" },
        { id: 8, name: "Export Data", category: "Editor" },
    ])
    const [selectedPermissions, setSelectedPermissions] = useState({
        Admin: [1, 2, 5, 7],
        Editor: [3, 4, 6, 8],
    })
    const handlePermissionChange = (categoryName, permissionId, checked) => {
        setSelectedPermissions((prevState) => {
            const updatedCategory = prevState[categoryName].includes(permissionId)
                ? prevState[categoryName].filter((id) => id !== permissionId)
                : [...prevState[categoryName], permissionId]
            return {
                ...prevState,
                [categoryName]: updatedCategory,
            }
        })
    }
    const handleUpdate = () => {
        console.log("Updating permissions:", selectedPermissions)
    }
    return (
        <div className="flex h-full w-full">
            <div className="flex-1 border-r p-6">
                <h2 className="mb-4 text-lg font-medium">Permissions</h2>
                <Tabs defaultValue="admin" className="flex flex-col">
                    <TabsList className="mb-4 flex w-full justify-start">
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                    </TabsList>
                    <TabsContent value="admin">
                        <div className="grid gap-2">
                            {availablePermissions
                                .filter((permission) => permission.category === "Admin")
                                .map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between rounded-md bg-muted p-3 text-sm font-medium"
                                    >
                                        <span>{permission.name}</span>
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={selectedPermissions.Admin.includes(permission.id)}
                                            onCheckedChange={(checked) => handlePermissionChange("Admin", permission.id, checked)}
                                        />
                                    </div>
                                ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="editor">
                        <div className="grid gap-2">
                            {availablePermissions
                                .filter((permission) => permission.category === "Editor")
                                .map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between rounded-md bg-muted p-3 text-sm font-medium"
                                    >
                                        <span>{permission.name}</span>
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={selectedPermissions.Editor.includes(permission.id)}
                                            onCheckedChange={(checked) => handlePermissionChange("Editor", permission.id, checked)}
                                        />
                                    </div>
                                ))}
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="mt-4">
                    <Button onClick={handleUpdate}>Update</Button>
                </div>
            </div>
        </div>
    )
}