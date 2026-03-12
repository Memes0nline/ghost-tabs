'use client';

import Link from 'next/link';
import ModeToggle from './ModeToggle';

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
      style={{
        borderColor: 'var(--border)',
        background: 'rgba(10, 10, 15, 0.85)',
      }}
    >
      <Link href="/" className="flex items-center gap-2 no-underline">
        <span
          className="text-xl font-black tracking-tight"
          style={{ color: 'var(--accent)' }}
        >
          GHOST
        </span>
        <span
          className="text-xl font-light tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          TABS
        </span>
      </Link>

      <ModeToggle />
    </header>
  );
}
