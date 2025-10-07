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
        'fixed top-0 left-0 right-0 z-50 px-6 md:px-8 lg:px-12',
        'bg-black/80 backdrop-blur-md border-b border-white/5',
        'h-16',
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
            'flex items-center transition-opacity hover:opacity-80',
          )}
        >
          <Image
            src="/logo.webp"
            alt="NUMUGAS"
            width={45}
            height={10}
            className="object-contain"
          />
        </Link>

        <nav className={cn('hidden md:flex items-center gap-6 lg:gap-8')}>
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className={cn(
            'md:hidden text-gray-400 hover:text-white transition-colors',
          )}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          type="button"
          aria-label="메뉴 토글"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          className={cn(
            'md:hidden fixed inset-0 top-16 bg-black/98 backdrop-blur-lg z-40',
            'flex flex-col items-center justify-center gap-8',
          )}
        >
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'text-lg font-medium text-gray-400 hover:text-white transition-colors duration-200',
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
