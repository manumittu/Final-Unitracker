import { useEffect, useState } from 'react'
import { stats } from '../services/ideaService'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie } from 'recharts'

export default function Dashboard() {
  const [data, setData] = useState({ byStatus: [], byDomain: [] })

  useEffect(() => {
    (async () => setData(await stats()))()
  }, [])

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.byStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data.byDomain} dataKey="count" nameKey="domain" outerRadius={90} label />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
