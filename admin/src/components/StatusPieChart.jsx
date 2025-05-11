// src/components/StatusPieChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function StatusPieChart({ data }) {
  const COLORS = ['#4ade80','#fbbf24','#f87171','#60a5fa'];
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="mb-2 text-gray-600">Orders by Status</h4>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="_id"
            cx="50%" cy="50%"
            outerRadius={70}
            label
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
