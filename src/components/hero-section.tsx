"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <video ref={videoRef} autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/baseball-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight font-display">
            <span className="text-red-600">RED</span> DRAGONS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            승리를 향한 열정, 불꽃같은 투혼으로 그라운드를 지배하는 팀
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              팀 소개
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
