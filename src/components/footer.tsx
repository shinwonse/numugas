import { Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-lg font-bold text-white">
              <span className="text-red-500">담장</span>NUMUGAS
            </h3>
            <p className="text-sm text-gray-500">
              나는 내가 생각한 것보다 훨씬 강하다
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="https://www.instagram.com/numugas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="https://www.youtube.com/@NUMUGAS-rk3rn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors duration-200"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-600">
            © 2026 담장NUMUGAS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
