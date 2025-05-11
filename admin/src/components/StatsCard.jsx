// src/components/StatsCard.jsx
export default function StatsCard({ title, value }) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  }
  