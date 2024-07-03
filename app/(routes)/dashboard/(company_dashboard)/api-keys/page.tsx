import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EyeIcon,  PlusIcon, TrashIcon } from "lucide-react";

export default function Page() {
    return (
        <div className="flex flex-col w-full bg-muted/40">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 my-4">
                <Card>
                    <CardHeader className="px-4 md:px-7">
                        <CardTitle>API Key Usage</CardTitle>
                        <CardDescription>Detailed metrics on API key usage for your application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-1">
                            <div className="grid gap-1">
                                <div className="text-sm font-medium">Total Requests</div>
                                <div className="text-2xl font-bold">987,654</div>
                            </div>
                            <div className="grid gap-1">
                                <div className="text-sm font-medium">Successful Requests</div>
                                <div className="text-2xl font-bold">912,345</div>
                            </div>
                            <div className="grid gap-1">
                                <div className="text-sm font-medium">Error Rate</div>
                                <div className="text-2xl font-bold">7.6%</div>
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Key</TableHead>
                                        <TableHead>Requests</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">abc123</div>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <EyeIcon className="h-4 w-4" />
                                                    <span className="sr-only">Reveal key</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>12,345</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">Active</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <TrashIcon className="h-4 w-4" />
                                                    <span className="sr-only">Delete key</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <PlusIcon className="h-4 w-4" />
                                                    <span className="sr-only">Create new key</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">def456</div>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <EyeIcon className="h-4 w-4" />
                                                    <span className="sr-only">Reveal key</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>8,765</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">Active</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <TrashIcon className="h-4 w-4" />
                                                    <span className="sr-only">Delete key</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <PlusIcon className="h-4 w-4" />
                                                    <span className="sr-only">Create new key</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">ghi789</div>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <EyeIcon className="h-4 w-4" />
                                                    <span className="sr-only">Reveal key</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>5,432</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">Inactive</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <TrashIcon className="h-4 w-4" />
                                                    <span className="sr-only">Delete key</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <PlusIcon className="h-4 w-4" />
                                                    <span className="sr-only">Create new key</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
