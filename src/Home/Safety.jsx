"use client"

import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle, XCircle, Flame, Droplets, Eye, Users } from "lucide-react"
import Navbar from "../Component/Navbar"
import "../App.css"

const dosData = [
  {
    icon: CheckCircle,
    title: "Follow Instructions",
    description: "Always read and follow the safety instructions on each cracker package carefully.",
  },
  {
    icon: Shield,
    title: "Buy Quality Crackers",
    description: "Purchase crackers only from licensed and reputable manufacturers for safety.",
  },
  {
    icon: Eye,
    title: "Outdoor Use Only",
    description: "Use all crackers outdoors in open spaces away from buildings and trees.",
  },
  {
    icon: Users,
    title: "Adult Supervision",
    description: "Children should always have adult supervision when using any fireworks.",
  },
  {
    icon: Droplets,
    title: "Keep Water Ready",
    description: "Always keep water buckets nearby for emergencies and safety.",
  },
]

const dontsData = [
  {
    icon: XCircle,
    title: "Don't Make Your Own",
    description: "Never attempt to make homemade fireworks or modify existing ones.",
  },
  {
    icon: Flame,
    title: "Don't Relight Duds",
    description: "Never try to relight crackers that didn't work properly the first time.",
  },
  {
    icon: AlertTriangle,
    title: "Don't Wear Loose Clothes",
    description: "Avoid loose clothing and synthetic materials when handling crackers.",
  },
  {
    icon: XCircle,
    title: "Don't Touch Used Crackers",
    description: "Never pick up or touch crackers after they've been used, even if they look safe.",
  },
  {
    icon: Shield,
    title: "Don't Store Improperly",
    description: "Never carry crackers in pockets or store them in unsafe locations.",
  },
]

const BigFireworkAnimation = ({ delay = 0, startPosition, endPosition, burstPosition, color }) => {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-6 h-6"
        style={{
          left: startPosition.x,
          top: startPosition.y,
          background: color.primary,
          boxShadow: `0 0 15px ${color.primary}`,
        }}
        animate={{
          x: [0, endPosition.x - startPosition.x],
          y: [0, endPosition.y - startPosition.y],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 2.5,
          delay: delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 8,
          ease: "easeOut",
        }}
      />

      <motion.div
        className="absolute"
        style={{
          left: burstPosition.x,
          top: burstPosition.y,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8, 0] }}
        transition={{
          duration: 4,
          delay: delay + 2.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 8,
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = i * 15 * (Math.PI / 180)
          const distance = screenWidth * 0.4
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance

          return (
            <motion.div
              key={`main-${i}`}
              className="absolute w-4 h-4"
              style={{
                background: `hsl(${(i * 15 + Math.random() * 60) % 360}, 80%, 65%)`,
                boxShadow: `0 0 20px hsl(${(i * 15 + Math.random() * 60) % 360}, 80%, 65%)`,
              }}
              animate={{
                x: [0, x * 0.3, x * 0.7, x],
                y: [0, y * 0.3, y * 0.7, y],
                opacity: [1, 0.8, 0.4, 0],
                scale: [1, 1.2, 0.8, 0],
              }}
              transition={{
                duration: 4,
                delay: delay + 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 8,
                ease: "easeOut",
              }}
            />
          )
        })}

        {Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10 * (Math.PI / 180)
          const distance = screenWidth * 0.25
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance

          return (
            <motion.div
              key={`secondary-${i}`}
              className="absolute w-2 h-2"
              style={{
                background: `hsl(${(i * 10 + Math.random() * 40) % 360}, 70%, 60%)`,
                boxShadow: `0 0 12px hsl(${(i * 10 + Math.random() * 40) % 360}, 70%, 60%)`,
              }}
              animate={{
                x: [0, x * 0.4, x * 0.8, x],
                y: [0, y * 0.4, y * 0.8, y],
                opacity: [1, 0.7, 0.3, 0],
                scale: [1, 1.1, 0.6, 0],
              }}
              transition={{
                duration: 3.5,
                delay: delay + 2.7,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 8,
                ease: "easeOut",
              }}
            />
          )
        })}

        {Array.from({ length: 48 }).map((_, i) => {
          const angle = i * 7.5 * (Math.PI / 180)
          const distance = screenWidth * 0.35
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance

          return (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1 h-1"
              style={{
                background: "#ffffff",
                boxShadow: "0 0 8px #ffffff",
              }}
              animate={{
                x: [0, x * 0.2, x * 0.6, x * 1.2],
                y: [0, y * 0.2, y * 0.6, y * 1.2],
                opacity: [1, 0.8, 0.4, 0],
                scale: [1, 0.8, 0.4, 0],
              }}
              transition={{
                duration: 3,
                delay: delay + 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 8,
                ease: "easeOut",
              }}
            />
          )
        })}

        <motion.div
          className="absolute w-32 h-32"
          style={{
            background: `radial-gradient(circle, ${color.primary}aa 0%, ${color.secondary}66 30%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [0, 3, 1.5, 0],
            opacity: [0, 1, 0.3, 0],
          }}
          transition={{
            duration: 2,
            delay: delay + 2.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 8,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </div>
  )
}

export default function Safety() {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080

  const fireworkConfigs = [
    {
      delay: 0,
      startPosition: { x: -50, y: 50 },
      endPosition: { x: screenWidth * 0.3, y: screenHeight * 0.3 },
      burstPosition: { x: screenWidth * 0.3, y: screenHeight * 0.3 },
      color: { primary: "#ec4899", secondary: "#f472b6", tertiary: "#f9a8d4" },
    },
    {
      delay: 2,
      startPosition: { x: screenWidth + 50, y: 50 },
      endPosition: { x: screenWidth * 0.7, y: screenHeight * 0.3 },
      burstPosition: { x: screenWidth * 0.7, y: screenHeight * 0.3 },
      color: { primary: "#d946ef", secondary: "#e879f9", tertiary: "#f0abfc" },
    },
    {
      delay: 4,
      startPosition: { x: -50, y: screenHeight + 50 },
      endPosition: { x: screenWidth * 0.25, y: screenHeight * 0.6 },
      burstPosition: { x: screenWidth * 0.25, y: screenHeight * 0.6 },
      color: { primary: "#be185d", secondary: "#db2777", tertiary: "#ec4899" },
    },
    {
      delay: 6,
      startPosition: { x: screenWidth + 50, y: screenHeight + 50 },
      endPosition: { x: screenWidth * 0.75, y: screenHeight * 0.6 },
      burstPosition: { x: screenWidth * 0.75, y: screenHeight * 0.6 },
      color: { primary: "#a21caf", secondary: "#c026d3", tertiary: "#d946ef" },
    },
    {
      delay: 8,
      startPosition: { x: screenWidth * 0.5, y: -50 },
      endPosition: { x: screenWidth * 0.5, y: screenHeight * 0.4 },
      burstPosition: { x: screenWidth * 0.5, y: screenHeight * 0.4 },
      color: { primary: "#ec4899", secondary: "#f472b6", tertiary: "#f9a8d4" },
    },
  ]

  return (
    <div className="min-h-screen text-slate-800 overflow-x-hidden relative bg-white">
      {/* Background Fireworks Animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {fireworkConfigs.map((config, index) => (
          <BigFireworkAnimation
            key={index}
            delay={config.delay}
            startPosition={config.startPosition}
            endPosition={config.endPosition}
            burstPosition={config.burstPosition}
            color={config.color}
          />
        ))}
      </div>

      {/* All content with higher z-index */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-pink-500 text-white px-8 py-4 inline-block shadow-lg">
                Safety Guidelines
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto mt-8">
                Safety first, fun always! Follow these important guidelines to ensure a safe and enjoyable crackers
                experience for kids and families. A little care goes a long way in preventing accidents.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Do's Section */}
        <section className="py-20 px-4 sm:px-6 relative -mt-30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-4 mobile:flex-col mobile:gap-2">
                <CheckCircle className="w-12 h-12 text-green-600" />
                <span className="bg-green-600 text-white px-6 py-2 shadow-lg">Safety Do's</span>
              </h2>
              <div className="w-24 h-1 mx-auto bg-green-600 shadow-lg" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mobile:gap-6">
              {dosData.map(({ icon: Icon, title, description }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative p-8 mobile:p-6 overflow-hidden cursor-pointer bg-green-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 mobile:w-14 mobile:h-14 mb-6 mobile:mb-4 mx-auto transition-all duration-500 group-hover:scale-110 bg-green-600 shadow-lg">
                      <Icon className="text-white w-8 h-8 mobile:w-6 mobile:h-6" />
                    </div>

                    <h3 className="text-xl mobile:text-lg font-bold text-center mb-4 mobile:mb-3 text-slate-800">
                      {title}
                    </h3>

                    <p className="text-slate-600 text-center leading-relaxed mobile:text-sm">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Don'ts Section */}
        <section className="py-20 px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-4 mobile:flex-col mobile:gap-2">
                <XCircle className="w-12 h-12 text-red-600" />
                <span className="bg-red-600 text-white px-6 py-2 shadow-lg">Safety Don'ts</span>
              </h2>
              <div className="w-24 h-1 mx-auto bg-red-600 shadow-lg" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mobile:gap-6">
              {dontsData.map(({ icon: Icon, title, description }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative p-8 mobile:p-6 overflow-hidden cursor-pointer bg-red-50 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 mobile:w-14 mobile:h-14 mb-6 mobile:mb-4 mx-auto transition-all duration-500 group-hover:scale-110 bg-red-600 shadow-lg">
                      <Icon className="text-white w-8 h-8 mobile:w-6 mobile:h-6" />
                    </div>

                    <h3 className="text-xl mobile:text-lg font-bold text-center mb-4 mobile:mb-3 text-slate-800">
                      {title}
                    </h3>

                    <p className="text-slate-600 text-center leading-relaxed mobile:text-sm">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Warning Banner */}
        <section className="py-16 px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative p-8 mobile:p-6 text-center overflow-hidden bg-yellow-50 border-2 border-yellow-300 shadow-lg"
            >
              <AlertTriangle className="w-16 h-16 mobile:w-12 mobile:h-12 text-yellow-600 mx-auto mb-6 mobile:mb-4" />
              <h3 className="text-2xl mobile:text-xl font-bold text-slate-800 mb-4 mobile:mb-3">
                Important Safety Reminder for Kids
              </h3>
              <p className="text-lg mobile:text-base text-slate-600 leading-relaxed">
                Remember kids, crackers are fun but safety comes first! Always have an adult help you, follow all the
                rules, and never try to use crackers alone. Let's make every celebration safe and memorable for everyone
                in the family.
              </p>
            </motion.div>
          </div>
        </section>

        <footer className="bg-slate-900 text-white py-16 mt-20 px-6 inset-0 mx-4 mb-10 border-4 border-pink-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 hundred:ml-[15%] mobile:text-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Profile</h2>
            <p className="text-pink-200 font-semibold">Kids Crackers Park</p>
            <p className="text-pink-100 mt-2">
              Spark joy, spread light—safe fireworks crafted for family celebrations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-pink-100">Kids Crackers Park</p>
            <p>
              Sree Sai Ram Crackers
              <br />
              Opposite to Kammavar Mandapam, 
              <br/>
              Sivakasi-626123
            </p>
            <a href="tel:+919629724212" className="text-pink-200 text-xl font-semibold hover:underline block">
              +91 96297 24212
            </a>
            <a href="tel:+919994637193" className="text-pink-200 text-xl font-semibold hover:underline block mt-2">
              +91 99946 37193
            </a>
            <p className="text-pink-100 mt-2">kidscrackerspark@gmail.com</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              {["Home", "About Us", "Price List", "Safety Tips", "Contact Us"].map((link) => (
                <li key={link}>
                  <a
                    href={link === "Home" ? "/" : `/${link.toLowerCase().replace(/ /g, "-")}`}
                    className="text-pink-200 hover:text-white transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-pink-700 pt-6 text-center text-sm text-pink-300 cursor-pointer">
          © 2025 <span className="text-white font-semibold">Kids Crackers Park</span>.
          <span className="text-white font-semibold">Developed by </span>
          SPD Solutions.
        </div>
      </footer>
      </div>
    </div>
  )
}
