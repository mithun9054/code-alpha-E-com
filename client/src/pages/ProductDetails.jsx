import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api.js';
import { toast } from '../utils/toast.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        if (res?.data?.success) setProduct(res.data.data);
        else toast.error(res?.data?.message || 'Failed to load product');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load product');
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <section className="py-6">
        <p className="text-center text-slate-600 dark:text-slate-300">Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/30">
          <img
            src={product.image || 'https://picsum.photos/seed/product-detail/900/700'}
            alt={product.name}
            className="h-72 w-full object-cover lg:h-full"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100">
            {product.category || 'General'}
          </div>

          <h1 className="mt-3 text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{product.description}</p>
          <p className="mt-4 text-2xl font-bold">${product.price}</p>

          <div className="mt-5 flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Quantity</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <button
            onClick={() => {
              addItem(product, qty);
              toast.success('Added to cart');
            }}
            className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}


