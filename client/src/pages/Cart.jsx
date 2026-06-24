import React, { useState } from 'react';
import api from '../utils/api.js';
import { toast } from '../utils/toast.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { token } = useAuth();
  const { cartItems, updateQuantity, removeItem, total, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!token) {
      toast.error('Please login to place an order');
      return;
    }

    setPlacing(true);
    try {
      const res = await api.post('/api/orders', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res?.data?.success) {
        toast.success('Order placed successfully');
        clearCart();
      } else {
        toast.error(res?.data?.message || 'Failed to place order');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cart</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Review your items</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white/70 p-6 text-center dark:border-slate-800 dark:bg-slate-900/30">
              <p className="text-slate-600 dark:text-slate-300">Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/30"
                >
                  <img
                    src={item.image || 'https://picsum.photos/seed/cart/200/160'}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">${item.price}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, Number(e.target.value || 1))
                        }
                        className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                      />

                      <button
                        onClick={() => {
                          removeItem(item.productId);
                          toast.success('Removed');
                        }}
                        className="ml-auto rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
            <h2 className="text-lg font-semibold">Total</h2>
            <p className="mt-2 text-3xl font-bold">${total.toFixed(2)}</p>

            <button
              disabled={cartItems.length === 0 || placing}
              onClick={handlePlaceOrder}
              className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {placing ? 'Placing...' : 'Place Order'}
            </button>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              Orders will deduct stock (demo assumes server cart).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


