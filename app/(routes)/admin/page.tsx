'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { BoxIcon, GiftIcon, GroupIcon, UsersIcon } from "lucide-react"
import useAdminDashboardMetrics, { useAdminDashboardChartData } from "@/lib/hooks/useAdminDashboardMetrics"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminDashboardChartResponse } from "@/lib/response-type/dashboard/AdminDashboardResponse"

export default function AdminDashboard() {
    const { data, isPending } = useAdminDashboardMetrics()
    const { data: chartData, isPending: chartLoading } = useAdminDashboardChartData()

    const transformData = (data: AdminDashboardChartResponse) => {
        return data.users.map((item, index) => ({
            month: item.month,
            total_users: item.total_users,
            total_boxes: data.boxes[index]?.total_boxes,
            total_campaigns: data.campaigns[index]?.total_campaigns,
        }))
    }

    const formattedChartData = chartData ? transformData(chartData) : []

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
                            {isPending ? (
                                <Skeleton className="h-8 w-full" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{data?.total_users}</div>
                                    <p className="text-xs text-muted-foreground">+{data?.users_percentage_increase}% from last month</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Boxes</CardTitle>
                            <BoxIcon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isPending ? (
                                <Skeleton className="h-8 w-full" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{data?.total_boxes}</div>
                                    <p className="text-xs text-muted-foreground">+{data?.boxes_percentage_increase}% from last month</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                            <GroupIcon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isPending ? (
                                <Skeleton className="h-8 w-full" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{data?.total_campaigns}</div>
                                    <p className="text-xs text-muted-foreground">+{data?.campaigns_percentage_increase}% from last month</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Gifts</CardTitle>
                            <GiftIcon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isPending ? (
                                <Skeleton className="h-8 w-full" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{data?.total_gifts}</div>
                                    <p className="text-xs text-muted-foreground">+{data?.gifts_percentage_increase}% from last month</p>
                                </>
                            )}
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
                            <BarchartChart data={formattedChartData} dataKey="total_users" isLoading={chartLoading} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Boxes</CardTitle>
                            <CardDescription>Active boxes by type</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarchartChart data={formattedChartData} dataKey="total_boxes" isLoading={chartLoading} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaigns</CardTitle>
                            <CardDescription>Campaign performance metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarchartChart data={formattedChartData} dataKey="total_campaigns" isLoading={chartLoading} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

function BarchartChart({ data, dataKey, isLoading }: { data: {}[], dataKey: string, isLoading: boolean }) {
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
            {isLoading ? (
                <Skeleton className="h-full w-full" />
            ) : (
                <BarChart
                    accessibilityLayer
                    data={data}
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
                    <Bar dataKey={dataKey} fill="var(--color-desktop)" radius={8} />
                </BarChart>
            )}
        </ChartContainer>
    )
}
