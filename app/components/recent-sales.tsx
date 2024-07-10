import Sales from '@/(routes)/dashboard/(company_dashboard)/components/box-sales';
import { BoxResponse } from '@/lib/response-type/company_dashboard/BoxesRespose';
import { Skeleton } from './ui/skeleton';

interface RecentSalesProp {
    data: BoxResponse[]
    loading: boolean
}



export function RecentSales({ data, loading }: RecentSalesProp) {
    return (
        <div
            className="space-y-8">
            {loading && (
                Array.from({ length: 5 }).map(item => (
                    <>
                        <div className="flex items-center w-full">
                            <Skeleton className='h-9 w-9 rounded-full' />
                            <div className="ml-4 space-y-1 w-full">
                                <Skeleton className='w-[100%] h-9' />
                                <Skeleton className='w-[100%] h-9' />
                            </div>
                        </div >
                    </>
                ))
            )
            }

            {
                data.map((box_sale) => (
                    <Sales key={box_sale.id} sale={box_sale} />
                ))
            }
        </div >
    );
}
