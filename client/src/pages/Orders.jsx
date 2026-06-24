import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from '../utils/toast.js';

const statusBadge = (status) => {
  const s = (status || 'Processing').toLowerCase();
  if (s.includes('delivered') || s.includes('completed')) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
  }
  if (s.includes('cancel')) {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';
  }
  return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100';
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res?.data?.success) setOrders(res.data.data || []);
        else toast.error(res?.data?.message || 'Failed to load orders');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load orders');
      }
    };

    if (token) fetchOrders();
  }, [token]);

  return (
    <section className="py-6">
      <h1 className="text-2xl font-semibold">Order History</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Your past orders</p>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white/70 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 font-medium">{o._id?.slice?.(-6) || o._id}</td>
                <td className="px-4 py-3">{o.items?.length || 0}</td>
                <td className="px-4 py-3">${Number(o.total || 0).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(o.status)}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}

            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-600 dark:text-slate-300">
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}


