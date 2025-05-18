import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-red-600">담장</span>NUMUGAS
            </h3>
            <p className="mb-4">나는 내가 생각한 것보다 훨씬 강하다</p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">팀 정보</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-red-500 transition-colors">
                  구단 소개
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-500 transition-colors">
                  선수단
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-500 transition-colors">
                  코칭 스태프
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-500 transition-colors">
                  구단 역사
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© 2025 담장NUMUGAS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
