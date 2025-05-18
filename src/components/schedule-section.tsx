"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const upcomingGames = [
  {
    id: 1,
    opponent: "블루 타이거즈",
    date: "2023년 8월 15일",
    time: "오후 6:30",
    location: "레드 드래곤즈 스타디움",
    isHome: true,
  },
  {
    id: 2,
    opponent: "그린 이글스",
    date: "2023년 8월 18일",
    time: "오후 5:00",
    location: "이글스 파크",
    isHome: false,
  },
  {
    id: 3,
    opponent: "골든 라이온즈",
    date: "2023년 8월 20일",
    time: "오후 2:00",
    location: "라이온즈 필드",
    isHome: false,
  },
  {
    id: 4,
    opponent: "퍼플 팬서스",
    date: "2023년 8월 23일",
    time: "오후 6:30",
    location: "레드 드래곤즈 스타디움",
    isHome: true,
  },
]

export function ScheduleSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="경기일정" className="py-24 bg-gradient-to-b from-black to-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4 font-display"
          >
            <span className="text-red-600">경기</span> 일정
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            레드 드래곤즈의 다가오는 경기 일정을 확인하세요.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`${
                  game.isHome ? "border-l-4 border-l-red-600" : "border-l-4 border-l-gray-600"
                } bg-gray-900 border-gray-800 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300`}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>vs {game.opponent}</span>
                    {game.isHome ? (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">홈</span>
                    ) : (
                      <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">원정</span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{game.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={16} className="text-gray-400" />
                      <span>{game.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{game.location}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="w-full text-center text-sm text-gray-400">
                    {game.isHome ? "홈 경기" : "원정 경기"}
                  </div>
                </CardFooter>
              </Card>
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
            전체 일정 보기
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
