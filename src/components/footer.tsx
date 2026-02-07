import { cn } from '@/lib/cn';
import { Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative py-16">
      {/* Glass Background */}
      <div
        className={cn(
          'absolute inset-x-4 inset-y-0',
          'bg-white/5 backdrop-blur-xl backdrop-saturate-150',
          'border border-white/10',
          'rounded-t-3xl',
        )}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-white">
              <span className="text-red-500">담장</span>NUMUGAS
            </h3>
            <p className="text-sm text-gray-400">
              나는 내가 생각한 것보다 훨씬 강하다
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://www.instagram.com/numugas/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'p-3 rounded-xl',
                'bg-white/5 border border-white/10',
                'text-gray-400',
                'transition-all duration-300',
                'hover:bg-white/10 hover:text-white hover:border-white/20',
              )}
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="https://www.youtube.com/@NUMUGAS-rk3rn"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'p-3 rounded-xl',
                'bg-white/5 border border-white/10',
                'text-gray-400',
                'transition-all duration-300',
                'hover:bg-white/10 hover:text-white hover:border-white/20',
              )}
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2026 담장NUMUGAS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
