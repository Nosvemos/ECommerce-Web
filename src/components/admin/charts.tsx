'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '@/lib/utils'

const Charts = ({data: { salesData }} : {
  data: {
    salesData: {
      month: string,
      totalSales: number
    }[]
  }
}) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={salesData}>
        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => { return String(formatCurrency(value)).slice(0, -3); }} />
        <Bar dataKey='totalSales' fill="currentColor" radius={[1, 1, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Charts