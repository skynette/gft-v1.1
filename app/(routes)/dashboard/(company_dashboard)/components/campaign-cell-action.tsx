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

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

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
        onError(error) {
            toast.error('Unable to add box to campaign')
        },
    });

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('copied.')
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            // delete action goes here
            router.refresh()
            toast.success('deleted successfully.')
        } catch (error) {
            toast.error('Make sure you removed all products using this category before deleting it.')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

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
                    setIsOpenSheet(true);
                }}>
                    <Edit className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => showAddToBox(true)}>
                    <PlusSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setOpen(true)}>
                    <Trash className="h-5 w-5" />
                </Button>
            </div>
        </>
    )
}
