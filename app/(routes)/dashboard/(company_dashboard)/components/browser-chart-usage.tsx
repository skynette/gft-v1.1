import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Globe2, Compass, Box } from "lucide-react"

const browsers = [
    { name: "Chrome", icon: Chrome, usage: 64, change: 2.1, color: "#4285F4" },
    { name: "Safari", icon: Compass, usage: 19, change: -0.5, color: "#000000" },
    { name: "Firefox", icon: Globe2, usage: 3.7, change: -0.8, color: "#FF7139" },
    { name: "Edge", icon: Box, usage: 3.2, change: 0.3, color: "#0078D7" },
    { name: "Opera", icon: Globe2, usage: 2.3, change: 0.1, color: "#FF1B2D" },
]

export default function BrowserUsageChart() {
    const maxUsage = Math.max(...browsers.map(b => b.usage))

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Browser Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {browsers.map((browser) => (
                        <div key={browser.name} className="flex items-center space-x-4">
                            <browser.icon className="w-8 h-8 text-muted-foreground" />
                            <div className="flex-grow">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-medium">{browser.name}</h3>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-2xl font-bold">{browser.usage}%</span>
                                        <span
                                            className={`text-sm ${browser.change > 0 ? "text-green-500" : "text-red-500"
                                                }`}
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
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}