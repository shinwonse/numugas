import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-red-600">RED</span> DRAGONS
            </h3>
            <p className="mb-4">승리를 향한 열정, 불꽃같은 투혼으로 그라운드를 지배하는 팀</p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
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

          <div>
            <h4 className="text-white font-bold mb-4">팬 서비스</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-red-500 transition-colors">
                  티켓 구매
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-500 transition-colors">
                  팬클럽 가입
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-500 transition-colors">
                  굿즈샵
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-500 transition-colors">
                  스타디움 안내
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">문의</h4>
            <address className="not-italic">
              <p>서울특별시 강남구 야구로 123</p>
              <p>레드 드래곤즈 스타디움</p>
              <p className="mt-2">전화: 02-123-4567</p>
              <p>이메일: info@reddragons.com</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© 2023 레드 드래곤즈. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
