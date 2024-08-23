import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpIcon } from "lucide-react"

export default function CardStats() {
  // Sample data for the chart
  const chartData = [20, 40, 30, 50, 35, 45, 55, 40, 48]
  const max = Math.max(...chartData)
  const min = Math.min(...chartData)

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Total Boxes</h2>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">67,987</span>
            <span className="flex items-center text-sm text-pink-500">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              0.75%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Last 6 days</p>
        </div>
        <div className="mt-4 h-12">
          <svg className="w-full h-full" viewBox="0 0 100 40">
            <polyline
              points={chartData
                .map((value, index) => `${index * (100 / (chartData.length - 1))},${40 - ((value - min) / (max - min)) * 40}`)
                .join(" ")}
              fill="none"
              stroke="#ec4899"
              strokeWidth="2"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}