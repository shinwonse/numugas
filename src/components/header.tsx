'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/cn';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NAVIGATION_ITEMS = [
  { label: '팀 소개', href: '/about' },
  { label: '기록', href: '/stats' },
  { label: '선수단', href: '/players' },
  { label: '라인업', href: '/lineup' },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed top-4 left-4 right-4 z-50',
        'view-transition-header',
      )}
    >
      {/* Apple Glass UI Container */}
      <div
        className={cn(
          'mx-auto max-w-5xl',
          'px-6 h-14',
          'rounded-2xl',
          'bg-black/40 backdrop-blur-xl backdrop-saturate-150',
          'border border-white/10',
          'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          'transition-all duration-300',
        )}
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'flex items-center',
              'transition-all duration-200',
              'hover:opacity-80 hover:scale-[1.02]',
            )}
          >
            <Image
              src="/logo.webp"
              alt="NUMUGAS"
              width={40}
              height={10}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div
              className={cn(
                'flex items-center gap-1',
                'bg-white/5 rounded-xl px-1 py-1',
              )}
            >
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'px-4 py-1.5 rounded-lg',
                    'text-sm font-medium',
                    'text-gray-400',
                    'transition-all duration-200',
                    'hover:text-white hover:bg-white/10',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-xl',
                  'text-gray-400',
                  'hover:text-white hover:bg-white/10',
                  'transition-all duration-200',
                )}
                aria-label="메뉴 토글"
              >
                <Menu size={20} strokeWidth={2} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className={cn(
                'bg-black/60 backdrop-blur-xl backdrop-saturate-150',
                'border-white/10 border-t-0',
                'rounded-b-2xl',
              )}
            >
              <SheetTitle className="sr-only">메뉴</SheetTitle>
              <div className="flex flex-col items-center justify-center gap-6 py-8 mt-4">
                {NAVIGATION_ITEMS.map((item) => (
                  <SheetClose key={item.label} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'px-6 py-2 rounded-xl',
                        'text-lg font-medium',
                        'text-gray-400',
                        'transition-all duration-200',
                        'hover:text-white hover:bg-white/10',
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
