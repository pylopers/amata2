// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { fetchDashboard, fetchFrequentUsers } from '../services/api';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import NewUsersChart from '../components/NewUsersChart';
import StatusPieChart from '../components/StatusPieChart';

export default function Dashboard({ token }) {
  const [stats, setStats]       = useState(null);
  const [error, setError]       = useState('');
  const todayString             = new Date().toISOString().slice(0,10);
  const [endDate, setEndDate]   = useState(todayString);
  const [productView, setProductView] = useState('all');
  const [freqInfo, setFreqInfo] = useState({ count: 0 });

  // Fetch main dashboard stats
  useEffect(() => {
    setStats(null);
    fetchDashboard(token, endDate)
      .then(setStats)
      .catch(err => setError(err.message));
  }, [token, endDate]);

  // Fetch frequent-users count
  useEffect(() => {
    fetchFrequentUsers(token)
      .then(setFreqInfo)
      .catch(() => {});
  }, [token]);

  // CSV download handler
  const downloadFrequentUsersCSV = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/frequent-users/download`,
        { headers: { token } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'frequent_users.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed: ' + err.message);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>Loading...</div>;

  const {
    totalUsers, totalOrders, totalProducts,
    totalRevenue, inStockCount, outStockCount,
    dailySales, newUsers, statusBreakdown
  } = stats;

  // Decide displayed product metric
  let productLabel = 'All Products';
  let productValue = totalProducts;
  if (productView === 'inStock') {
    productLabel = 'In-Stock';
    productValue = inStockCount;
  } else if (productView === 'outStock') {
    productLabel = 'Out-of-Stock';
    productValue = outStockCount;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* End-date picker */}
      <div className="mb-6">
        <label className="mr-2">Show sales up to:</label>
        <input
          type="date"
          value={endDate}
          max={todayString}
          onChange={e => setEndDate(e.target.value)}
          className="border rounded p-1"
        />
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Users"       value={totalUsers} />
        <StatsCard title="Orders"      value={totalOrders} />
        <StatsCard title="Revenue (₹)" value={totalRevenue} />

        {/* Products card with dropdown */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm text-gray-500">{productLabel}</h4>
            <select
              value={productView}
              onChange={e => setProductView(e.target.value)}
              className="text-xs border rounded p-1"
            >
              <option value="all">All ({totalProducts})</option>
              <option value="inStock">In-Stock ({inStockCount})</option>
              <option value="outStock">Out-of-Stock ({outStockCount})</option>
            </select>
          </div>
          <p className="mt-2 text-2xl font-bold">{productValue}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SalesChart data={dailySales} />
        <NewUsersChart data={newUsers} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatusPieChart data={statusBreakdown} />

        {/* Frequent Users card with Download */}
        <div className="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm text-gray-500">
              Frequent Users (&gt;2 orders/yr)
            </h4>
            <p className="mt-2 text-2xl font-bold">{freqInfo.count}</p>
          </div>
          <button
            onClick={downloadFrequentUsersCSV}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download List
          </button>
        </div>
      </div>
    </div>
  );
}
