// src/services/api.js
import { backendUrl } from '../App';

export const fetchDashboard = async (token, endDate) => {
  const url = new URL(`${backendUrl}/api/dashboard/all`);
  if (endDate) url.searchParams.set('endDate', endDate);
  const res = await fetch(url, { headers: { token } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const fetchFrequentUsers = async (token) => {
  const res = await fetch(`${backendUrl}/api/dashboard/frequent-users`, {
    headers: { token }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
};
