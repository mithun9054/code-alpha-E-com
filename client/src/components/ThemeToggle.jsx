import React from 'react';

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-100 dark:hover:bg-slate-900"
      aria-label="Toggle theme"
    >
      🌓
    </button>
  );
}

