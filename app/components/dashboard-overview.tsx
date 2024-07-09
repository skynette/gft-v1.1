'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Skeleton } from './ui/skeleton';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const data = months.map(month => ({
    name: month,
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
}));

type chartRecord = {
    name: string;
    totalBoxes: number;
    totalCampaigns: number;
}

interface ChartData {
    chartDataFormatted: chartRecord[]
    loading: boolean
}

export function DashboardOverview({ chartDataFormatted, loading }: ChartData) {
    return (
        <div style={{ width: '100%', height: 350 }}>
            {loading ? (
                <Skeleton className='w-full h-[350px]' />
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataFormatted}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={14}
                            tickLine={true}
                            axisLine={true}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={14}
                            tickLine={true}
                            axisLine={true}
                            allowDecimals={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip />
                        <Bar dataKey="totalBoxes" name="Total Boxes Created" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="totalCampaigns" name="Total Campaigns Created" fill="#efa134" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
