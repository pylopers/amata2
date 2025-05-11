// src/components/NewUsersChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function NewUsersChart({ data }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="mb-2 text-gray-600">New Users (7d)</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
