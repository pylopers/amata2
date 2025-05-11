// src/components/SalesChart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="mb-2 text-gray-600">Sales Last 7 Days</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
