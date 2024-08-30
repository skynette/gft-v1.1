'use client'

import { Button } from "@/components/ui/button"
import { Copy, Edit, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"
import { GiftBoxColumn } from "./columns-gift-received"
import { toast } from "sonner"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface CellActionProps {
    data: GiftBoxColumn
}

export const CellActionGiftSent: React.FC<CellActionProps> = ({ data }) => {
    const session = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('Copied.');
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            // delete action goes here
            router.refresh();
            toast.success('Deleted successfully.');
        } catch (error) {
            toast.error('Make sure you removed all products using this category before deleting it.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex space-x-2">
                <Link href={`/dashboard/gifter/gift-boxes/${data.id}/setup?edit=${true}`}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                    </Button>
                </Link>
                {/* <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onCopy(data.id)}>
                    <Copy className="h-4 w-4" />
                </Button> */}
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
};
