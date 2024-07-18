'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { BoxIcon, GiftIcon, GroupIcon,  PiIcon, UsersIcon } from "lucide-react"

export default function Component() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-muted/40">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <UsersIcon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12,345</div>
                            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Boxes</CardTitle>
                            <BoxIcon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3,456</div>
                            <p className="text-xs text-muted-foreground">+12.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                            <GroupIcon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">124</div>
                            <p className="text-xs text-muted-foreground">+8.3% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                            <PiIcon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.3M</div>
                            <p className="text-xs text-muted-foreground">+15% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Gift Visits</CardTitle>
                            <GiftIcon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45,678</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>New users over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarchartChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Boxes</CardTitle>
                            <CardDescription>Active boxes by type</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarchartChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaigns</CardTitle>
                            <CardDescription>Campaign performance metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarchartChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>API Requests</CardTitle>
                            <CardDescription>API request volume over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarchartChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Gift Visits</CardTitle>
                            <CardDescription>Gift visit trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarchartChart />
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest platform activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>New User Signup</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>2 hours ago</TableCell>
                                    <TableCell>Signed up for Pro plan</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Box Created</TableCell>
                                    <TableCell>Jane Smith</TableCell>
                                    <TableCell>4 hours ago</TableCell>
                                    <TableCell>Created a new Box for Campaign A</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Campaign Launched</TableCell>
                                    <TableCell>Bob Johnson</TableCell>
                                    <TableCell>1 day ago</TableCell>
                                    <TableCell>Launched a new marketing campaign</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>API Request</TableCell>
                                    <TableCell>Alice Lee</TableCell>
                                    <TableCell>2 days ago</TableCell>
                                    <TableCell>Fetched user data</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gift Redeemed</TableCell>
                                    <TableCell>Tom Wilson</TableCell>
                                    <TableCell>3 days ago</TableCell>
                                    <TableCell>Redeemed a gift card</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

function BarchartChart() {
    return (
        <ChartContainer
            config={{
                desktop: {
                    label: "Desktop",
                    color: "hsl(var(--primary))",
                },
            }}
            className="min-h-[300px] w-full"
        >
            <BarChart
                accessibilityLayer
                data={[
                    { month: "January", desktop: 186 },
                    { month: "February", desktop: 305 },
                    { month: "March", desktop: 237 },
                    { month: "April", desktop: 73 },
                    { month: "May", desktop: 209 },
                    { month: "June", desktop: 214 },
                    { month: "July", desktop: 214 },
                    { month: "August", desktop: 214 },
                    { month: "September", desktop: 214 },
                    { month: "October", desktop: 214 },
                    { month: "November", desktop: 214 },
                    { month: "December", desktop: 214 },
                ]}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
        </ChartContainer>
    )
}
