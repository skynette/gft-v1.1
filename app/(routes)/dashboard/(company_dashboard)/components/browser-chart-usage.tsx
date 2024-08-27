import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Globe2, Compass, Box } from "lucide-react"

const iconMap = {
    "Chrome": Chrome,
    "Safari": Compass,
    "Firefox": Globe2,
    "Edge": Box,
    "Opera": Globe2,
}

export default function BrowserUsageChart() {
    const { data, isPending, isError } = useCompanyBrowserUsage();

    if (isError) {
        return <div>Error loading browser usage data</div>;
    }

    const browsers = data?.browsers || [];
    const maxUsage = Math.max(...browsers.map(b => b.usage));

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Browser Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                {isPending ? (
                    <BrowserUsageSkeleton />
                ) : browsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No browser usage data available
                    </div>
                ) : (
                    <div className="space-y-6">
                        {browsers.map((browser) => {
                            const Icon = iconMap[browser.name as keyof typeof iconMap] || Globe2;
                            return (
                                <div key={browser.name} className="flex items-center space-x-4">
                                    <Icon className="w-8 h-8 text-muted-foreground" />
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-sm font-medium">{browser.name}</h3>
                                            <div className="flex items-baseline space-x-2">
                                                <span className="text-2xl font-bold">{browser.usage}%</span>
                                                <span
                                                    className={`text-sm ${browser.change > 0 ? "text-green-500" : "text-red-500"}`}
                                                >
                                                    {browser.change > 0 ? "+" : ""}
                                                    {browser.change}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${(browser.usage / maxUsage) * 100}%`,
                                                    backgroundColor: browser.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


import { Skeleton } from "@/components/ui/skeleton"
import { useCompanyBrowserUsage } from "@/lib/hooks/useCompanyBrowserData";

function BrowserUsageSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-grow">
                        <div className="flex justify-between items-baseline mb-1">
                            <Skeleton className="h-4 w-20" />
                            <div className="flex items-baseline space-x-2">
                                <Skeleton className="h-6 w-12" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        </div>
                        <Skeleton className="h-2 w-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}