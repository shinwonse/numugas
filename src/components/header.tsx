'use client';

import { cn } from '@/lib/cn';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAVIGATION_ITEMS = [
  { label: '기록', href: '/stats' },
  { label: '선수단', href: '/players' },
  { label: '라인업', href: '/lineup' },
] as const;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12',
        'bg-black/95 shadow-lg border-b border-white/10',
        'h-20',
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        <Link
          href="/"
          className="text-2xl font-bold flex items-center gap-2 text-white font-display"
        >
          <Image src="/logo.webp" alt="title" width={50} height={10} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-red-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/95 z-40 flex flex-col items-center pt-10 gap-6">
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xl text-gray-300 hover:text-red-500 transition-colors"
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
