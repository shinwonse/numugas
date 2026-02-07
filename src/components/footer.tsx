import { cn } from '@/lib/cn';
import { Instagram, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative">
      {/* Gradient fade from content to footer */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none" />

      {/* Main Footer Content */}
      <div className="relative bg-black">
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-20">
          {/* Logo with glow */}
          <div className="flex flex-col items-center gap-10">
            <Link href="/" className="group">
              <Image
                src="/title.png"
                alt="담장NUMUGAS"
                width={280}
                height={56}
                className={cn(
                  'object-contain opacity-60',
                  'transition-all duration-500',
                  'group-hover:opacity-100',
                  'group-hover:drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]',
                )}
              />
            </Link>

            {/* Tagline */}
            <p className="text-sm text-gray-500 tracking-wide">
              나는 내가 생각한 것보다 훨씬 강하다
            </p>

            {/* Social Links - Minimal style */}
            <div className="flex items-center gap-6">
              <Link
                href="https://www.instagram.com/numugas/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-gray-600',
                  'transition-all duration-300',
                  'hover:text-white hover:scale-110',
                )}
                aria-label="Instagram"
              >
                <Instagram size={22} strokeWidth={1.5} />
              </Link>
              <div className="w-px h-4 bg-white/10" />
              <Link
                href="https://www.youtube.com/@NUMUGAS-rk3rn"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-gray-600',
                  'transition-all duration-300',
                  'hover:text-white hover:scale-110',
                )}
                aria-label="YouTube"
              >
                <Youtube size={22} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-600">
                © 2026 담장NUMUGAS. All rights reserved.
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-700">Made with</span>
                <span className="text-red-500 text-sm animate-pulse">♥</span>
                <span className="text-xs text-gray-700">for baseball</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
