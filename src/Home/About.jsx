"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../Component/Navbar"

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

export default function About() {
  const [blasts, setBlasts] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newBlasts = Array.from({ length: 6 }).map(() => ({
        id: Date.now() + Math.random(),
        top: Math.random() * 60 + 10,
        left: Math.random() * 90,
        color: ["#ec4899", "#f97316", "#8b5cf6", "#22c55e", "#ef4444", "#06b6d4"][Math.floor(Math.random() * 6)],
      }))
      setBlasts((prev) => [...prev, ...newBlasts])
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen text-slate-800 flex flex-col bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <Navbar />
      <div className="flex-grow">
        <div className="hidden md:block w-full h-64 md:h-80 lg:h-96 mt-[100px] overflow-hidden mx-auto px-4 md:px-8">
          <img
            src="/aboutbanner.png"
            alt="About banner"
            className="w-full h-full object-cover border-4 border-pink-300"
          />
        </div>

        <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 1.2 }}
            className="relative w-full h-96 overflow-hidden border-4 border-pink-400"
          >
            <div className="absolute inset-0 -z-10">
              {["rocket1", "rocket2", "rocket3"].map((rocket, i) => (
                <div
                  key={rocket}
                  className={`absolute w-6 h-16 bg-gradient-to-t from-pink-400 to-purple-600 animate-${rocket}`}
                  style={{ left: `${i * 60 + 20}px`, bottom: `${i * 20 + 10}px` }}
                />
              ))}
            </div>
            <img src="/aboutimage.jpg" alt="About Us" className="w-full h-full object-cover shadow-2xl" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 1 }}
            className="space-y-6 text-slate-700"
          >
            <h2 className="text-4xl font-bold text-slate-900">About Us</h2>
            <h3 className="text-2xl font-semibold text-pink-600">Kids Crackers Park</h3>
            <p>
              Kids Crackers Park is a premium supplier of safe, child-friendly fireworks. From traditional celebrations
              to modern extravaganzas, our products bring sparkle to every family moment.
            </p>
            <p>
              Our trusted brands—French Terry, Vinayaga, Sony, and Century—symbolize quality, innovation, and safe fun
              for children and families.
            </p>
            <p>
              With a strong presence across Tamil Nadu and South India, we proudly serve families and event organizers
              with customized service and unmatched safety standards.
            </p>
          </motion.div>
        </section>

        <section className="py-24 overflow-hidden mx-4 bg-gradient-to-r from-pink-600 to-purple-700 border-4 border-pink-500">
          <div className="absolute inset-0 z-0 pointer-events-none">
            {blasts.map((blast) => (
              <div
                key={blast.id}
                className="absolute w-4 h-4 animate-blast"
                style={{ top: `${blast.top}%`, left: `${blast.left}%`, backgroundColor: blast.color }}
              />
            ))}
          </div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto text-center px-6 text-white"
          >
            <h2 className="text-4xl font-bold mb-4 text-yellow-300 drop-shadow-lg">
              🎆 Exclusive Kids Crackers With Safety First!
            </h2>
            <p className="text-lg mb-4">
              Celebrate festivals with <span className="font-semibold text-yellow-200">Kids Crackers Park</span>. Your
              trusted shop for safe fireworks and family delights.
            </p>
            <p className="text-lg mb-6">
              Explore sparklers, gift boxes, fountains, and more—with simple online ordering and doorstep delivery.
            </p>
            <a href="tel:+919629724212" className="text-pink-200 text-xl font-semibold hover:underline block">
              📞 +91 96297 24212
            </a>
            <a href="tel:+919994637193" className="text-pink-200 text-xl font-semibold hover:underline block mt-2">
              📞 +91 99946 37193
            </a>
          </motion.div>
        </section>

        <section className="py-32 px-4 md:px-8 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Safety First",
                  content:
                    "Our motto is SAFETY FIRST. Kids Crackers Park has adopted several stringent quality testing measures as well as safety norms defined by the fireworks industry for child-friendly products.",
                },
                {
                  title: "Family Vision",
                  content:
                    "The company's presence is established amongst family retailers which makes our safe products accessible to all parts of India. Our products have carved a niche for their child-safe quality.",
                },
                {
                  title: "Our Mission",
                  content:
                    "We prioritize family safety, child-friendly designs, beautiful packaging, effective service, and reasonable prices. Our products are family-oriented and meet the highest safety standards.",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative py-8 px-6 transition-all duration-500 overflow-hidden cursor-pointer text-center bg-white border-4 border-pink-300 hover:border-pink-500 hover:bg-pink-50"
                >
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-pink-600 group-hover:text-pink-700 mb-4 transition-colors duration-500 drop-shadow-sm">
                      {card.title}
                    </h3>
                    <p className="text-base text-slate-600 group-hover:text-slate-700 leading-relaxed transition-colors duration-500">
                      {card.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

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
      <style>
        {`
          @keyframes rocket1 {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-200px) rotate(20deg); opacity: 0; }
          }
          @keyframes rocket2 {
            0% { transform: translateY(0) rotate(-10deg); opacity: 1; }
            100% { transform: translateY(-220px) rotate(30deg); opacity: 0; }
          }
          @keyframes rocket3 {
            0% { transform: translateY(0) rotate(15deg); opacity: 1; }
            100% { transform: translateY(-180px) rotate(-20deg); opacity: 0; }
          }
          .animate-rocket1 { animation: rocket1 3s linear infinite; }
          .animate-rocket2 { animation: rocket2 4s ease-in-out infinite; }
          .animate-rocket3 { animation: rocket3 3.5s ease-in-out infinite; }

          @keyframes blast {
            0% { transform: scale(0.5); opacity: 1; }
            40% { transform: scale(1.5); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .animate-blast {
            animation: blast 1.4s ease-out forwards;
          }
        `}
      </style>
    </div>
  )
}
