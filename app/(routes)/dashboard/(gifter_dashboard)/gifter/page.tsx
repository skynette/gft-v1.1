'use client';

import GiftBoxTableArea from "../components/table-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { Gift, Loader, LucideIcon, PackageOpen, UsersRound } from "lucide-react";
import useGetDashboardMetrics from "@/lib/hooks/useGetDashboardMetrics";
import useGiftOverview from "@/lib/hooks/useGiftOverview";
import { GiftBoxColumn } from "../components/columns";

export interface GiftOverview {
    name: string;
    totalGiftSent: number;
    totalGiftReceived: number;
}

const GiftInfo = ({ Icon, title, value, rate }: { title: string, Icon: LucideIcon, value: number, rate: string }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                    {title}
                </CardTitle>
                <Icon size={24} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {`${rate}% from last month`}
                </p>
            </CardContent>
        </Card>
    )
}

const GifterDashboard = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

    const { data, isPending } = useGetDashboardMetrics();
    const barChartData: GiftOverview[] = data?.weekdays.map((day, index) => ({ name: days[index], totalGiftSent: data.gifts_given[index], totalGiftReceived: data.gifts_received[index] })) ?? [];

    const { data: gifts } = useGiftOverview();
    const giftSent: GiftBoxColumn[] = gifts?.at(0)?.data?.map((gift) => ({ id: gift.id, name: gift.title, owner:gift.owner, receiver_name: gift.receiver_name, days_of_gifting: gift.days_of_gifting, open_date: gift.open_date, createdAt: gift.created_at })) ?? [];
    const giftReceived: GiftBoxColumn[] = gifts?.at(1)?.data?.map((gift) => ({ id: gift.id, name: gift.title, owner:gift.owner, receiver_name: gift.receiver_name, days_of_gifting: gift.days_of_gifting, open_date: gift.open_date, createdAt: gift.created_at })) ?? [];

    console.log(giftSent)

    if (isPending)
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center">
                <Loader className="animate-spin w-12 h-12" />
                <p className="font-normal text-lg">Fetching dashboard metrics...</p>
            </div>
        )

    return (
        <div className="container flex-col">

            <div className="grid gap-4 my-8 md:grid-cols-2 lg:grid-cols-4">
                <GiftInfo
                    Icon={Gift}
                    title="Total Giftboxes Owned"
                    value={data?.total_boxes_owned ?? 0}
                    rate="+20.1"
                />

                <GiftInfo
                    Icon={UsersRound}
                    title="Total Boxes Received"
                    value={data?.boxes_received ?? 0}
                    rate="+180.1"
                />

                <GiftInfo
                    Icon={PackageOpen}
                    title="Total Boxes Opened"
                    value={data?.gift_boxes_opened ?? 0}
                    rate="+180.1"
                />
            </div>

            {/* chart section */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <Overview data={barChartData} />
                </CardContent>
            </Card>

            {/* table section */}
            <div className="flex-1 space-y-4 pt-6">
                <GiftBoxTableArea title={`Gift boxes sent (${giftSent.length ?? 0})`} data={giftSent} />
                <GiftBoxTableArea title={`Gift boxes received (${giftReceived.length ?? 0})`} data={giftReceived} />
            </div>
        </div>
    );
}

export default GifterDashboard;