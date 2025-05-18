"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => { window.removeEventListener("scroll", handleScroll); }
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12",
        isScrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-white font-display">
          <span className="text-red-600">RED</span> DRAGONS
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["홈", "팀", "경기일정", "통계", "뉴스"].map((item) => (
            <Link key={item} href={`#${item}`} className="text-gray-300 hover:text-red-500 transition-colors">
              {item}
            </Link>
          ))}
        </nav>

        <button className="md:hidden text-white" onClick={() => { setIsMenuOpen(!isMenuOpen); }}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/95 z-40 flex flex-col items-center pt-10 gap-6">
          {["홈", "팀", "경기일정", "통계", "뉴스"].map((item) => (
            <Link
              key={item}
              href={`#${item}`}
              className="text-xl text-gray-300 hover:text-red-500 transition-colors"
              onClick={() => { setIsMenuOpen(false); }}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
