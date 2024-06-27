'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Jan',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Feb',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Mar',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Apr',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'May',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jun',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jul',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Aug',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Sep',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Oct',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Nov',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Dec',
    totalGiftSent: Math.floor(Math.random() * 5000) + 1000,
    totalGiftReceived: Math.floor(Math.random() * 5000) + 1000,
  }
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={14}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={14}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Bar dataKey="totalGiftSent" name="Total gift sent" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="totalGiftReceived" name="Total gift received" fill="#efa134" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
