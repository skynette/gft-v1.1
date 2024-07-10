import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BoxResponse } from "@/lib/response-type/company_dashboard/BoxesRespose";

interface SalesProp {
    sale: BoxResponse;
}

const Sales = ({ sale }: SalesProp) => {
    return (
        <div className="flex items-center">
            <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>{sale.receiver_name}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.receiver_name}</p>
                <p className="text-sm text-muted-foreground">
                    {sale.receiver_email ? sale.receiver_phone : ''}
                </p>
            </div>
        </div>
    )
}

export default Sales