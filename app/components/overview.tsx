'use client';

import { GiftOverview } from '@/(routes)/dashboard/(gifter_dashboard)/gifter/page';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function Overview({ data }: { data?: GiftOverview[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
        <Bar dataKey="totalGiftSent" name="Total gift sent" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="totalGiftReceived" name="Total gift received" fill="#efa134" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
