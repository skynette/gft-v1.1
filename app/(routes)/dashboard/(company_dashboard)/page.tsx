'use client';

import { DashboardOverview } from "@/components/dashboard-overview";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { RecentSales } from "@/components/recent-sales";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCompanyDashboardMetrics, { useCompanyChartData } from "@/lib/hooks/useCompanyDashboardMetrics";
import useGetCompanyBox from "@/lib/hooks/useGetCompanyBox";
import { useSession } from "next-auth/react";

export default function page() {
    const session = useSession();
    const { data, isPending } = useCompanyDashboardMetrics();
    const { data: chartData, isPending: chartDataLoading } = useCompanyChartData();

    const { data: boxSalesData, isPending: boxSalesLoading, isSuccess } = useGetCompanyBox();
    const numSold = boxSalesData?.results.filter((item) => item.is_setup)
    const salesData = numSold?.slice(0, 5)
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const chartDataFormatted = months.map(month => {
        const boxData = chartData?.boxes.find(box => box.month === month);
        const campaignData = chartData?.campaigns.find(campaign => campaign.month === month);

        return {
            name: month,
            totalBoxes: boxData ? boxData.total_boxes : 0,
            totalCampaigns: campaignData ? campaignData.total_campaigns : 0
        };
    });

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Hi, Welcome back {session.data?.user.email} 👋
                    </h2>
                    <div className="hidden items-center space-x-2 md:flex">
                        {/* <CalendarDateRangePicker /> */}
                        {/* <Button>Download</Button> */}
                    </div>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Boxes</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isPending ? <Skeleton className="w-full h-8" /> : data?.boxes.total_boxes}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        {isPending ? <Skeleton className="w-full h-8" /> : `+${data?.boxes.boxes_percentage_increase}% increase from last month`}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Gifts</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isPending ? <Skeleton className="w-full h-8" /> : data?.gifts.total_gifts}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        {isPending ? <Skeleton className="w-full h-8" /> : `+${data?.gifts.gifts_percentage_increase}% increase from last month`}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <path d="M2 10h20" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isPending ? <Skeleton className="w-full h-8" /> : data?.campaigns.total_campaigns}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        {isPending ? <Skeleton className="w-full h-8" /> : `+${data?.campaigns.campaigns_percentage_increase}% increase from last month`}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Gift Visits</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isPending ? <Skeleton className="w-full h-8" /> : `+${data?.gift_visits.total_gift_visits}`}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        {isPending ? <Skeleton className="w-full h-8" /> : `+${data?.gift_visits.gift_visits_percentage_increase} increase from last month`}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* overview section */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <DashboardOverview chartDataFormatted={chartDataFormatted} loading={chartDataLoading} />
                                </CardContent>
                            </Card>
                            <Card className="col-span-4 md:col-span-3">
                                <CardHeader>
                                    <CardTitle>Recent Box Sales</CardTitle>
                                    <CardDescription>
                                        You made {numSold?.length ?? 0} sales this month.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentSales data={salesData ?? []} loading={boxSalesLoading} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    );
}
