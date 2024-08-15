'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminUpdatePermissionGroups, useGetAdminPermissionGroups, useGetAdminPermissionGroupsItems, useGetAdminPermissions } from "@/lib/hooks/admin-hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type PermissionItem = {
    id: number
    label: string
    selected: boolean;
}

const Page = () => {

    const params = useParams();
    const id = params.id.toString();
    const { data: allPermissions } = useGetAdminPermissions();
    const { data } = useGetAdminPermissionGroupsItems(id);
    const [availablePermission, setAvailablePermission] = useState<PermissionItem[]>();
    const [selectedPermission, setSelectedPermission] = useState<PermissionItem[]>();

    const { mutate, isPending } = useAdminUpdatePermissionGroups(id);

    useEffect(() => {
        setAvailablePermission(allPermissions?.map(item => ({
            id: item.id,
            label: item.label,
            selected: !!data?.permissions.find(e => item.id === e.id)
        })));

        setSelectedPermission(data?.permissions.filter(item => {
            return item.groups.includes(+id)
        }).map(item => ({
            id: item.id,
            label: item.label,
            selected: true
        })));

        // setAvailablePermission(
        //     permissionGroup?.permissions.filter(e => {
        //         return !data?.permissions?.some(item => item.id === e.id)
        //     }).map(item => ({
        //         id: item.id,
        //         label: item.label,
        //         selected: false
        //     }))
        // );

        // setSelectedPermission(
        //     permissionGroup?.permissions.filter(e => {
        //         return data?.permissions?.some(item => item.id === e.id)
        //     }).map(item => ({
        //         id: item.id,
        //         label: item.label,
        //         selected: false
        //     }))
        // );
    }, [data, allPermissions])

    return (
        <div className='p-10'>
            <Heading
                title='Permission Groups'
                description="Manage users permission"
            />
            <p className="capitalize font-semibold text-lg">{data?.name?.replaceAll('_', ' ')}</p>

            <div className="grid gap-x-2 grid-cols-[2fr_.1fr_2fr] mt-4">
                <div className="flex flex-col">
                    <p>All permissions</p>
                    <ScrollArea className="h-80 border rounded-md p-2 mt-2">
                        {availablePermission?.map(item => (
                            <div key={item.id} className="flex space-x-2 py-2 items-center">
                                <Checkbox id={item.label + 'all'} checked={item.selected} onCheckedChange={e => {
                                    const newItem: PermissionItem = { ...item, selected: !item.selected };
                                    setAvailablePermission(prev => {
                                        return prev?.map(oldItem => oldItem.id === newItem.id ? newItem : oldItem)
                                    });
                                }} />
                                <Label htmlFor={item.label + 'all'}>{item.label}</Label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
                <div className="flex flex-col space-y-2 justify-center px-1">
                    <Button variant='outline' onClick={() => {
                        const permissions = availablePermission?.filter(e => e.selected).map(item =>
                        ({
                            id: item.id,
                            label: item.label,
                            selected: true
                        }));
                        setSelectedPermission(permissions);
                    }}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button variant='outline' onClick={() => {
                        setSelectedPermission(prev => {
                            return prev?.filter(item => item.selected)
                        });
                    }}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex flex-col">
                    <p>Available</p>
                    <ScrollArea className="h-80 border rounded-md p-2 mt-2">
                        {selectedPermission?.map(item => (
                            <div key={item.id} className="flex space-x-2 py-2 items-center">
                                <Checkbox id={item.label + 'available'} checked={item.selected} onCheckedChange={e => {
                                    const newItem: PermissionItem = { ...item, selected: !item.selected };
                                    setSelectedPermission(prev => {
                                        return prev?.map(oldItem => oldItem.id === newItem.id ? newItem : oldItem)
                                    });
                                }} />
                                <Label htmlFor={item.label + 'available'}>{item.label}</Label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
            <Button
                isLoading={isPending}
                disabled={isPending}
                className="mt-2"
                type="button"
                onClick={() => {
                    if (selectedPermission && (selectedPermission.length) > 0)
                        mutate(selectedPermission.map(e => e.id.toString()));
                }}
            >Save changes</Button>
        </div >
    )
}

export default Page;