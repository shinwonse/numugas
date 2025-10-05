'use client';

import { cn } from '@/lib/cn';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NAVIGATION_ITEMS = [
  { label: '기록', href: '/stats' },
  { label: '선수단', href: '/players' },
  { label: '라인업', href: '/lineup' },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12',
        'bg-black/95 shadow-lg border-b border-white/10',
        'h-20',
      )}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto flex items-center justify-between h-full',
        )}
      >
        <Link
          href="/"
          className={cn(
            'text-2xl font-bold flex items-center gap-2 text-white font-display',
          )}
        >
          <Image src="/logo.webp" alt="title" width={50} height={10} />
        </Link>

        <nav className={cn('hidden md:flex items-center gap-8')}>
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'text-gray-300 hover:text-red-500 transition-colors',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className={cn('md:hidden text-white')}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          type="button"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className={cn(
            'md:hidden fixed inset-0 top-16 bg-black/95 z-40 flex flex-col items-center pt-10 gap-6',
          )}
        >
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'text-xl text-gray-300 hover:text-red-500 transition-colors',
              )}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
