"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../Component/Navbar"
import { MapPin, Phone, Mail, Globe } from "lucide-react"

const BigFireworkAnimation = ({ delay = 0, startPosition, endPosition, burstPosition, color }) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-6 h-6"
        style={{
          left: startPosition.x,
          top: startPosition.y,
          background: `linear-gradient(180deg, ${color.primary} 0%, ${color.secondary} 50%, ${color.tertiary} 100%)`,
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
          const distance = dimensions.width * 0.4
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
          const distance = dimensions.width * 0.25
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
          const distance = dimensions.width * 0.35
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

export default function Contact() {
  const [screenDimensions, setScreenDimensions] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    const updateDimensions = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const contactCards = [
    {
      icon: MapPin,
      title: "Our Shop Location",
      content: ["Kids Crackers Park", "No.19 kamak road", "Opposite to Kammavar Mandapam main entrance", "Sivakasi - 626123"],
    },
    {
      icon: Phone,
      title: "Mobile Number",
      content: [
        { text: "+91 96297 24212", href: "tel:+919629724212" },
        { text: "+91 99946 37193", href: "tel:+919994637193" },
      ],
    },
    {
      icon: Mail,
      title: "Email Address",
      content: [{ text: "kidscrackerspark@gmail.com", href: "mailto:kidscrackerspark@gmail.com" }],
    },
  ]

  const fireworkConfigs = [
    {
      delay: 0,
      startPosition: { x: -50, y: 50 },
      endPosition: { x: screenDimensions.width * 0.3, y: screenDimensions.height * 0.3 },
      burstPosition: { x: screenDimensions.width * 0.3, y: screenDimensions.height * 0.3 },
      color: { primary: "#ec4899", secondary: "#f472b6", tertiary: "#fbcfe8" },
    },
    {
      delay: 2,
      startPosition: { x: screenDimensions.width + 50, y: 50 },
      endPosition: { x: screenDimensions.width * 0.7, y: screenDimensions.height * 0.3 },
      burstPosition: { x: screenDimensions.width * 0.7, y: screenDimensions.height * 0.3 },
      color: { primary: "#f97316", secondary: "#fb923c", tertiary: "#fed7aa" },
    },
    {
      delay: 4,
      startPosition: { x: -50, y: screenDimensions.height + 50 },
      endPosition: { x: screenDimensions.width * 0.25, y: screenDimensions.height * 0.6 },
      burstPosition: { x: screenDimensions.width * 0.25, y: screenDimensions.height * 0.6 },
      color: { primary: "#8b5cf6", secondary: "#a78bfa", tertiary: "#ddd6fe" },
    },
    {
      delay: 6,
      startPosition: { x: screenDimensions.width + 50, y: screenDimensions.height + 50 },
      endPosition: { x: screenDimensions.width * 0.75, y: screenDimensions.height * 0.6 },
      burstPosition: { x: screenDimensions.width * 0.75, y: screenDimensions.height * 0.6 },
      color: { primary: "#22c55e", secondary: "#4ade80", tertiary: "#bbf7d0" },
    },
    {
      delay: 8,
      startPosition: { x: screenDimensions.width * 0.5, y: -50 },
      endPosition: { x: screenDimensions.width * 0.5, y: screenDimensions.height * 0.4 },
      burstPosition: { x: screenDimensions.width * 0.5, y: screenDimensions.height * 0.4 },
      color: { primary: "#06b6d4", secondary: "#22d3ee", tertiary: "#a5f3fc" },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
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

      <div className="relative z-10">
        <Navbar />

        <section className="max-w-7xl mx-auto py-30 px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get in touch with us for all your safe fireworks needs. We're here to make your family celebrations
              memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {contactCards.map((card, index) => (
              <div key={index} className="relative group">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border-2 border-pink-500">
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="relative pt-8 p-8 bg-white border-4 border-pink-300 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 overflow-hidden hover:border-pink-500 hover:bg-pink-50">
                  <div className="relative z-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{card.title}</h2>
                    <div className="space-y-2">
                      {card.content.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          {typeof item === "string" ? (
                            <p className="text-gray-700 text-center text-sm leading-relaxed">{item}</p>
                          ) : (
                            <a
                              href={item.href}
                              className="block text-pink-600 hover:text-pink-800 text-center text-sm transition-colors duration-200 hover:underline"
                            >
                              {item.text}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border-2 border-emerald-500">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="relative pt-8 p-8 bg-white border-4 border-emerald-300 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 overflow-hidden hover:border-emerald-500 hover:bg-emerald-50">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Us on Map</h2>
                <div className="overflow-hidden shadow-lg border-2 border-gray-300">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.0487539047143!2d77.79800291478508!3d9.453334793222115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cf8c8c8c8c8c%3A0x8c8c8c8c8c8c8c8c!2sPhoenix%20Crackers%2C%20Anil%20Kumar%20Eye%20Hospital%20Opp.%2C%20Sattur%20Road%2C%20Sivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
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
