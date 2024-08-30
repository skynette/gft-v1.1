'use client'

import { Button } from "@/components/ui/button"
import { Copy, Edit, PlusSquare, Trash } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { CampaignColumns } from "./campaign-columns"
import { CampaignSheet } from "./campaign-sheet"
import { createQueryString } from "@/lib/utils"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AlertDialogAction } from "@radix-ui/react-alert-dialog"
import useGetCompanyBox from "@/lib/hooks/useGetCompanyBox"
import { MultiSelect, Option } from "react-multi-select-component"
import useAddBoxToCampaign from "@/lib/hooks/useAddBoxToCampaign"
import { useQueryClient } from "@tanstack/react-query"

interface CellActionProps {
    data: CampaignColumns
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const queryClient = useQueryClient();
    const [openSheet, setIsOpenSheet] = useState(false);
    const [addToBox, showAddToBox] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { data: box } = useGetCompanyBox();
    const [selected, setSelected] = useState<Option[]>([]);
    const options = box?.results.filter(item => item.box_campaign === null).map(item => (
        { value: item.id, label: item.title }
    )) ?? [];

    const { mutate, isPending } = useAddBoxToCampaign({
        id: data.id,
        onSuccess() {
            toast.success('Box added to campaign');
            queryClient.invalidateQueries({
                queryKey: ['company-box']
            })
            setSelected([])
        },
        onError() {
            toast.error('Unable to add box to campaign')
        },
    });

    return (
        <>
            <AlertDialog open={addToBox} onOpenChange={showAddToBox}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add existing box to campaign</AlertDialogTitle>
                        <div className="flex">
                            <MultiSelect
                                options={options}
                                value={selected}
                                onChange={setSelected}
                                labelledBy="Add box to campaign"
                                className="w-full"
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={isPending} onClick={() => mutate(
                            selected.map(i => i.value)
                        )}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >

            <CampaignSheet title='Update Campaign' initialValue={data} isOpen={openSheet} onClose={() => {
                setIsOpenSheet(false);
                createQueryString(pathname, router, 'query', '');
            }} />

            <div className="flex space-x-2">
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                    createQueryString(pathname, router, 'query', 'update');
                    router.push(`/dashboard/campaigns/create?query=update&id=${data.id}`)
                    router.refresh()
                }}>
                    <Edit className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => showAddToBox(true)}>
                    <PlusSquare className="h-5 w-5" />
                </Button>
            </div>
        </>
    )
}
