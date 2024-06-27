import { giftBoxData } from "@/constants/data";
import GiftBoxTableArea from "../components/table-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { DollarSign, Gift, LucideIcon, PackageOpen, User, UsersRound } from "lucide-react";

const GiftInfo = ({ Icon, title, value, rate }: { title: string, Icon: LucideIcon, value: string, rate: string }) => {
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

const GifterDashboard = async () => {
    return (
        <div className="container flex-col">

            <div className="grid gap-4 my-8 md:grid-cols-2 lg:grid-cols-4">
                <GiftInfo
                    Icon={DollarSign}
                    title="Total Boxes Sent"
                    value="45"
                    rate="+20.1"
                />

                <GiftInfo
                    Icon={UsersRound}
                    title="Gifts sent"
                    value="+2350"
                    rate="+180.1"
                />

                <GiftInfo
                    Icon={Gift}
                    title="Gifts opened"
                    value="+2350"
                    rate="+180.1"
                />

                <GiftInfo
                    Icon={PackageOpen}
                    title="Boxes opened"
                    value="+2350"
                    rate="+180.1"
                />
            </div>

            {/* chart section */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <Overview />
                </CardContent>
            </Card>

            {/* table section */}
            <div className="flex-1 space-y-4 pt-6">
                <GiftBoxTableArea data={giftBoxData} />
            </div>
        </div>
    );
}

export default GifterDashboard;