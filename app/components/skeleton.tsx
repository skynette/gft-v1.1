import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
    return (
        <div className="border rounded-lg w-full">
            <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">
                                <Skeleton className="h-4 w-full" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-full" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-full" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-full" />
                            </TableHead>
                            <TableHead className="text-right">
                                <Skeleton className="h-4 w-full" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}