import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            🛒
          </span>
          <span className="text-sm font-semibold md:text-base">CodeAlpha Store</span>
        </Link>


        <nav className="hidden items-center gap-4 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-slate-900 dark:text-slate-100 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive
                ? 'text-slate-900 dark:text-slate-100 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? 'text-slate-900 dark:text-slate-100 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }
          >
            Cart
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-100"
          >
            <span className="text-lg">🛍️</span>
            <span className="ml-2">{itemCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

