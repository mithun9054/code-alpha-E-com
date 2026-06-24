import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import { toast } from '../utils/toast.js';
import { useCart } from '../context/CartContext.jsx';

export default function Home() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        if (res?.data?.success) setProducts(res.data.data || []);
        else toast.error(res?.data?.message || 'Failed to load products');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Shop</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">Browse our products</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white/70 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/30"
          >
            <div className="relative">
              <img
                src={p.image || 'https://picsum.photos/seed/product/600/400'}
                alt={p.name}
                className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                {p.category || 'General'}
              </div>
            </div>

            <div className="p-4">
              <h2 className="line-clamp-1 text-base font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">${p.price}</p>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  to={`/product/${p._id}`}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  Details
                </Link>
                <button
                  onClick={() => addItem(p, 1)}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-center text-slate-600 dark:text-slate-300">No products yet.</p>
      ) : null}
    </section>
  );
}


