"use client"

import { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const newsItems = [
  {
    id: 1,
    title: "김태훈 선수, 이번 시즌 최고의 투수상 수상",
    date: "2023년 8월 10일",
    excerpt: "레드 드래곤즈의 에이스 김태훈 선수가 이번 시즌 최고의 투수로 선정되었습니다.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 2,
    title: "레드 드래곤즈, 연승 행진 중",
    date: "2023년 8월 5일",
    excerpt: "레드 드래곤즈가 현재 8연승을 기록하며 리그 선두를 달리고 있습니다.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    title: "신인 선수 이민우, 데뷔 첫 홈런 기록",
    date: "2023년 7월 28일",
    excerpt: "신인 선수 이민우가 프로 데뷔 후 첫 홈런을 기록하며 팀 승리에 기여했습니다.",
    image: "/placeholder.svg?height=300&width=500",
  },
]

export function NewsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="뉴스" className="py-24 bg-gradient-to-b from-gray-900 to-black" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4 font-display"
          >
            <span className="text-red-600">최신</span> 뉴스
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            레드 드래곤즈의 최신 소식과 이벤트를 확인하세요.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Calendar size={16} />
                  <span>{news.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors">{news.title}</h3>
                <p className="text-gray-400 mb-4">{news.excerpt}</p>
                <Button variant="link" className="p-0 text-red-500 hover:text-red-400 flex items-center gap-2">
                  자세히 보기 <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            모든 뉴스 보기
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
