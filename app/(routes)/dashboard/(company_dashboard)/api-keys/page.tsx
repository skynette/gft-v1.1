"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, RefreshCwIcon } from "lucide-react";
import useGetCompanyAPIKey from "@/lib/hooks/useGetCompanyAPIKey";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function Page() {
    const { data, isPending } = useGetCompanyAPIKey();

    const renderStatusBadge = (status: string) => {
        if (status === "active") {
            return <Badge variant="outline" className="bg-green-200 text-green-800">{status}</Badge>;
        } else {
            return <Badge variant="outline" className="bg-red-200 text-red-800">{status}</Badge>;
        }
    };

    const [revealedKeys, setRevealedKeys] = useState<string[]>([]);

    const toggleReveal = (key: string) => {
        if (revealedKeys.includes(key)) {
            setRevealedKeys(revealedKeys.filter(k => k !== key));
        } else {
            setRevealedKeys([...revealedKeys, key]);
        }
    };

    const getHiddenKey = (key: string) => {
        const visibleLength = 5; // Number of characters to show
        return key.slice(0, visibleLength) + '***';
    };


    return (
        <div className="flex flex-col w-full bg-muted/40">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 my-4">
                <Card>
                    <CardHeader className="px-4 md:px-7">
                        <CardTitle>API Key Usage</CardTitle>
                        <CardDescription>Detailed metrics on API key usage for your company.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-1">
                            <div className="grid gap-1">
                                <div className="text-sm font-medium">Total Requests</div>
                                {isPending && <Skeleton className="w-full h-8" />}
                                <div className="text-2xl font-bold">{data?.metrics.total_requests}</div>
                            </div>
                            <div className="grid gap-1">
                                <div className="text-sm font-medium">Successful Requests</div>
                                {isPending ? <Skeleton className="w-full h-8" /> : <div className="text-2xl font-bold">{data?.metrics.total_requests}</div>}
                            </div>
                            <div className="grid gap-1">
                                <div className="text-sm font-medium">Error Rate</div>
                                {isPending ? <Skeleton className="w-full h-8" /> : <div className="text-2xl font-bold">0%</div>}
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-full">Key</TableHead>
                                        <TableHead>Requests</TableHead>
                                        <TableHead>Max Requests</TableHead>
                                        <TableHead>Last Used</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isPending ? (
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Skeleton className="w-full h-6" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-full h-6" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-full h-6" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-full h-6" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-full h-6" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-full h-6" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) :
                                        data?.results.map((api_key) => (
                                            <TableRow key={api_key.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                    <div className="font-medium">
                                                            {revealedKeys.includes(api_key.id.toLocaleString()) ? api_key.key : getHiddenKey(api_key.key)}
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleReveal(api_key.id.toLocaleString())}>
                                                            <EyeIcon className="h-4 w-4" />
                                                            <span className="sr-only">Reveal key</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{api_key.num_of_requests_made}</TableCell>
                                                <TableCell>{api_key.max_requests}</TableCell>
                                                <TableCell>{api_key.last_used}</TableCell>
                                                <TableCell>
                                                    {renderStatusBadge(api_key.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <RefreshCwIcon className="h-4 w-4" />
                                                            <span className="sr-only">Regenerate key</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
