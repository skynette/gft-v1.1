'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminUpdatePermissionGroups, useGetAdminPermissionGroups, useGetAdminPermissionGroupsItems } from "@/lib/hooks/admin-hooks";
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
    const { data: allPermissions } = useGetAdminPermissionGroups();
    const { data } = useGetAdminPermissionGroupsItems(id);
    const [availablePermission, setAvailablePermission] = useState<PermissionItem[]>();
    const [selectedPermission, setSelectedPermission] = useState<PermissionItem[]>();

    const { mutate, isPending } = useAdminUpdatePermissionGroups(id);

    useEffect(() => {
        const permissionGroup = allPermissions?.find(item => item.id === +id);
        setAvailablePermission(permissionGroup?.permissions.map(item => ({
            id: item.id,
            label: item.label,
            selected: false
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
                        let selected = availablePermission?.filter(item => item.selected) ?? [];
                        let newSelected = [...selected || []];
                        selected?.forEach(item => {
                            selectedPermission?.forEach(e => {
                                if (e.id === item.id) newSelected = selected.filter(i => i.id === item.id)
                            })
                        })
                        setSelectedPermission(prev => ([...newSelected, ...prev || []]));
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