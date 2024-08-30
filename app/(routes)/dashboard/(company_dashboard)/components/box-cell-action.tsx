'use client'

import { Button } from "@/components/ui/button"
import { Copy, Edit, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import useDeleteBox from "@/lib/hooks/useDeleteBox"
import { useQueryClient } from "@tanstack/react-query"
import { BoxSheet } from "./box-sheet"
import { createQueryString } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { BoxResponse } from "@/lib/response-type/company_dashboard/BoxesRespose"
import { AlertModal } from "@/components/modals/alert-modal"

interface CellActionProps {
    data: BoxResponse
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const pathname = usePathname();
    const client = useQueryClient();
    const [openSheet, setIsOpenSheet] = useState(false);
    const [openAlert, setIsOpenAlert] = useState(false);
    const { mutate, isPending } = useDeleteBox({
        onSuccess() {
            client.invalidateQueries({ queryKey: ['company-box'] });
            toast.success('deleted successfully.');
            setIsOpenAlert(false);
        },
        onError(error) {
            toast.error("deletion failed");
            setIsOpenAlert(false);
        },
    });

    const onCopy = (id: string) => {
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/dashboard/gifter/gift-boxes/${id}/setup`;
        navigator.clipboard.writeText(fullUrl);
        toast.success('Copied.');
    };

    return (
        <>
            <AlertModal
                isOpen={openAlert}
                onClose={() => setIsOpenAlert(false)}
                onConfirm={() => mutate(data.id)}
                loading={isPending}
            />
            <BoxSheet
                isOpen={openSheet}
                title="Update box"
                initialValue={data}
                onClose={() => {
                    setIsOpenSheet(false);
                    createQueryString(pathname, router, 'query', '');
                }}
            />
            <div className="flex space-x-2">
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                    createQueryString(pathname, router, 'query', 'update');
                    setIsOpenSheet(true);
                }}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onCopy(data.id)}>
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsOpenAlert(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
}
