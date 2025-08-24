import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Rocket, Volume2, Bomb, Disc, CloudSun, Heart, SmilePlus, Clock, Copy, Check } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import Navbar from "../Component/Navbar"
import "../App.css"
import { API_BASE_URL } from "../../Config"

const categories = [
  { name: "Sparklers", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { name: "Rockets", icon: Rocket, color: "from-blue-500 to-cyan-500" },
  { name: "Single Sound Crackers", icon: Volume2, color: "from-green-500 to-emerald-500" },
  { name: "Atom Bombs", icon: Bomb, color: "from-red-500 to-orange-500" },
  { name: "Ground Chakkars", icon: Disc, color: "from-yellow-500 to-amber-500" },
  { name: "Sky Shots", icon: CloudSun, color: "from-indigo-500 to-purple-500" },
]

const statsData = [
  { label: "Happy Families", value: 100, icon: Heart, color: "from-rose-400 to-pink-600" },
  { label: "Premium Products", value: 200, icon: Sparkles, color: "from-violet-400 to-purple-600" },
  { label: "Satisfied Kids", value: 500, icon: SmilePlus, color: "from-blue-400 to-indigo-600" },
  { label: "Celebration Days", value: 365, icon: Clock, color: "from-emerald-400 to-green-600" },
]

const navLinks = ["Home", "About Us", "Price List", "Safety Tips", "Contact Us"]

const Carousel = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)

  const mediaItems = useMemo(() => {
    const items = media && typeof media === "string" ? JSON.parse(media) : Array.isArray(media) ? media : []
    return items.sort((a, b) => {
      const aStr = typeof a === "string" ? a : ""
      const bStr = typeof b === "string" ? b : ""
      const isAVideo = aStr.startsWith("data:video/")
      const isBVideo = bStr.startsWith("data:video/")
      const isAGif = aStr.startsWith("data:image/gif") || aStr.toLowerCase().endsWith(".gif")
      const isBGif = bStr.startsWith("data:image/gif") || bStr.toLowerCase().endsWith(".gif")
      const isAImage = aStr.startsWith("data:image/") && !isAGif
      const isBImage = bStr.startsWith("data:image/") && !isBGif
      return (isAImage ? 0 : isAGif ? 1 : isAVideo ? 2 : 3) - (isBImage ? 0 : isBGif ? 1 : isBVideo ? 2 : 3)
    })
  }, [media])

  const isVideo = (item) => typeof item === "string" && item.startsWith("data:video/")

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  const handleNext = () => setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))

  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
  }

  const handleTouchEnd = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    const endX = e.changedTouches[0].clientX
    const diffX = startX - endX
    if (diffX > 50) handleNext()
    else if (diffX < -50) handlePrev()
  }

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="w-full h-30 bg-gradient-to-br from-gray-100 to-gray-200 mb-4 overflow-hidden flex items-center justify-center shadow-inner">
        <span className="text-gray-500 font-medium">No media available</span>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-30 mb-4 overflow-hidden select-none bg-gradient-to-br from-white to-gray-50 shadow-lg"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isVideo(mediaItems[currentIndex]) ? (
        <video src={mediaItems[currentIndex]} autoPlay muted loop className="w-full h-full object-contain p-2" />
      ) : (
        <img
          src={mediaItems[currentIndex] || "/placeholder.svg"}
          alt="Product"
          className="w-full h-full object-contain p-2"
        />
      )}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="mobile:hidden sm:flex absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-white to-gray-100 backdrop-blur-sm text-gray-700 flex items-center justify-center text-lg z-10 hover:from-gray-100 hover:to-gray-200 cursor-pointer transition-all duration-300 shadow-lg border border-white/20"
            aria-label="Previous media"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            className="mobile:hidden sm:flex absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-white to-gray-100 backdrop-blur-sm text-gray-700 flex items-center justify-center text-lg z-10 hover:from-gray-100 hover:to-gray-200 cursor-pointer transition-all duration-300 shadow-lg border border-white/20"
            aria-label="Next media"
          >
            <FaArrowRight />
          </button>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {mediaItems.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 transition-all duration-300 ${index === currentIndex ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125" : "bg-white/70 hover:bg-white/90"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const StatCard = ({ icon: Icon, value, label, delay, color }) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    if (inView && count === 0) {
      let start = 0
      const timer = setInterval(
        () => {
          start += 1
          setCount(start)
          if (start === value) clearInterval(timer)
        },
        Math.max(Math.floor(1000 / value), 10),
      )
      return () => clearInterval(timer)
    }
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative py-8 px-6 transition-all duration-500 overflow-hidden cursor-pointer bg-white shadow-xl hover:shadow-2xl border border-gray-200"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      ></div>
      <div className="relative z-10 text-center">
        <div
          className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${color} flex items-center justify-center shadow-lg border border-gray-200`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          {count}+
        </p>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [banners, setBanners] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [fastRunningProducts, setFastRunningProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const response = await res.json()
        let dataArray

        if (Array.isArray(response)) {
          dataArray = response
        } else if (response && Array.isArray(response.data)) {
          dataArray = response.data
        } else {
          console.error(`Expected an array or response.data to be an array, but received:`, response)
          setter([])
          return
        }

        if (url.includes("/api/products") || url.includes("/api/banners")) {
          setter(dataArray.filter((item) => item.is_active || item.fast_running))
        } else {
          setter(dataArray)
        }
      } catch (err) {
        console.error(`Error loading ${url}:`, err)
        setter([])
      }
    }

    fetchData(`${API_BASE_URL}/api/banners`, setBanners)
    fetchData(`${API_BASE_URL}/api/products`, setFastRunningProducts)

    const intervals = [
      setInterval(() => fetchData(`${API_BASE_URL}/api/banners`, setBanners), 1200 * 1000),
      setInterval(() => fetchData(`${API_BASE_URL}/api/products`, setFastRunningProducts), 30 * 1000),
    ]

    return () => intervals.forEach(clearInterval)
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 4000)
      return () => clearInterval(slideInterval)
    }
  }, [banners.length])

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-gray-800 overflow-x-hidden relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
    >
      <Navbar />

      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 flex items-center justify-center details-modal">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            className="relative shadow-2xl max-w-md w-full mx-4 overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-white/20"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {selectedProduct.productname}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-200"
                  aria-label="Close details modal"
                >
                  ×
                </button>
              </div>
              <Carousel media={selectedProduct.image} />
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-gradient-to-r from-purple-50 to-pink-50 p-4 border border-purple-100">
                  {selectedProduct.description || "Premium quality crackers perfect for your celebrations"}
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border border-purple-700"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center px-4 mobile:px-4 overflow-hidden hundred:mt-0 mobile:-mt-24 hundred:mb-55"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 hundred:h-[100%] mobile:h-[80%]"></div>
        <div className="w-full max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Kids
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Crackers Park
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full flex justify-center"
          >
            {banners.length > 0 ? (
              <div className="relative max-w-8xl hundred:h-[500px] tab:h-[400px] tab:w-full mobile:h-40 overflow-hidden bg-gradient-to-br from-white to-gray-100 shadow-2xl border-4 border-purple-200">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={banners[currentSlide]?.image_url || "/placeholder.svg"}
                    alt={banners[currentSlide]?.title || "Banner"}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7 }}
                  />
                </AnimatePresence>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-4 h-4 transition-all duration-300 border border-white ${index === currentSlide ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-125 shadow-lg" : "bg-white/70 hover:bg-white/90 hover:scale-110"}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-5xl h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner border-4 border-gray-300">
                <p className="text-gray-500 text-lg font-medium">Loading amazing banners...</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      <section className="py-32 px-4 sm:px-6 max-w-7xl mx-auto mobile:-mt-[280px] mb-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Trending Products
          </h2>
          <div className="w-40 h-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"></div>
        </motion.div>
        <div className="relative">
          <div
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {fastRunningProducts.slice(0, 12).map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative p-6 overflow-hidden cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-pink-50 transition-all duration-500 shadow-xl hover:shadow-2xl border border-white/20 flex-shrink-0 w-80"
                onClick={() => {
                  setSelectedProduct(product)
                  setShowDetailsModal(true)
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <Carousel media={product.image} />
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {product.productname}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description || "Premium quality crackers perfect for celebrations"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{product.price || "N/A"}
                    </span>
                    <button className="text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border border-purple-700">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-6 gap-2">
            <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 border border-gray-200">
              ← Scroll to see more products →
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 mobile:-translate-y-70 px-4 sm:px-6 max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Our Categories
          </h2>
          <div className="w-40 h-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"></div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(({ name, icon: Icon, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group relative p-8 overflow-hidden cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-pink-50 transition-all duration-500 shadow-xl hover:shadow-2xl border border-white/20"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>
              <div className="relative z-10">
                <div
                  className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br ${color} flex items-center justify-center shadow-lg border border-gray-200 mx-auto mb-6 transition-all duration-500 group-hover:scale-110`}
                >
                  <Icon className="text-white w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {name}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 text-center mb-6 transition-colors duration-300 bg-gradient-to-r from-gray-50 to-white p-4 border border-gray-100 leading-relaxed">
                  Premium quality {name} designed for safe family celebrations
                </p>
                <div className="text-center">
                  <button
                    onClick={() => navigate("/price-list")}
                    className={`px-8 py-3 cursor-pointer font-semibold transition-all duration-500 group-hover:scale-105 text-white bg-gradient-to-r ${color} shadow-lg hover:shadow-xl border border-purple-700`}
                  >
                    EXPLORE NOW
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 mobile:-translate-y-70 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Start Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Magical Celebration
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-6 border border-white/20"
          >
            Transform your special moments into unforgettable memories with our premium, child-safe fireworks. Every
            celebration deserves the magic of Kids Crackers Park.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button
              onClick={() => navigate("/price-list")}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-purple-700"
            >
              🎆 Shop Now
            </button>
            <button
              onClick={() => navigate("/contact-us")}
              className="px-12 py-4 border-2 border-purple-500 text-purple-700 font-semibold text-lg hover:bg-purple-50 hover:border-purple-600 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
            >
              💬 Contact Us
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-32 mobile:-translate-y-70 px-4 sm:px-6 max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Our Impact
          </h2>
          <div className="w-40 h-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"></div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, i) => (
            <StatCard key={i} {...stat} delay={i * 0.2} />
          ))}
        </div>
      </section>

      <footer className="px-4 sm:px-6 py-16 mobile:-translate-y-70 mobile:-mb-60 mb-10 relative bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 hundred:ml-[23%] tab:ml-[10%]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-purple-200 mb-2 font-semibold">Kids Crackers Park</p>
            <p className="text-purple-100 mb-10 leading-relaxed p-5 md:p-0 bg-white/10 backdrop-blur-sm border border-white/10">
              Creating magical moments for families with premium, safe fireworks. Every celebration becomes
              extraordinary with our carefully crafted products.
            </p>
            <div className="flex justify-center md:justify-start">
              <button
                className="mt-2 cursor-pointer text-white px-8 py-4 font-semibold transition-all duration-300 inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-105 border border-purple-700"
                onClick={() => navigate("/about-us")}
              >
                Learn More →
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="space-y-4 text-purple-100">
              <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/10">
                <p className="font-semibold text-purple-200 mb-2">📍 Address</p>
                <p>
                  Sree Sai Ram Crackers 
                  <br />
                  No.19 kamak road
                  <br />
                  Opposite to Kammavar Mandapam main entrance, 
                  <br/>
                  Sivakasi-626123
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/10">
                <p className="font-semibold text-purple-200 mb-2">📱 Mobile</p>
                <p>
                  +91 96297 24212
                  <br />
                  +91 99946 37193
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/10">
                <p className="font-semibold text-purple-200 mb-2">✉️ Email</p>
                <p>kidscrackerspark@gmail.com</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href={link === "Home" ? "/" : `/${link.toLowerCase().replace(/ /g, "-")}`}
                    className="text-purple-100 hover:text-white transition-colors font-medium hover:underline bg-white/5 hover:bg-white/10 px-4 py-2 block duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 max-w-5xl mx-auto text-sm text-purple-100 leading-relaxed relative z-10 text-center md:text-center"
        >
          {[
            "Following 2018 Supreme Court guidelines, we ensure 100% legal compliance in all our operations. Our products are available through authorized channels only. Contact us for personalized assistance and safe delivery options.",
            "Licensed and certified by relevant authorities. Kids Crackers Park maintains the highest safety standards in manufacturing, storage, and transportation. All our facilities comply with explosive safety regulations.",
          ].map((text, i) => (
            <p
              key={i}
              className="mb-4 text-purple-100 leading-relaxed p-5 md:p-0 bg-white/5 backdrop-blur-sm border border-white/10"
            >
              {text}
            </p>
          ))}
        </motion.div>
        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-purple-100 relative z-10">
          <p className="bg-white/5 backdrop-blur-sm p-4 border border-white/10">
            Copyright © 2025,{" "}
            <span className="text-white font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
              Kids Crackers Park
            </span>
            . All rights reserved. Crafted with ❤️ by <span className="text-white font-semibold">SPD Solutions</span>
          </p>
        </div>
      </footer>

      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 right-6 hundred:w-32 hundred:h-32 mobile:w-20 mobile:h-20 text-white font-bold text-sm flex items-center justify-center transition-all duration-300 z-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl border-2 border-white/20"
        onClick={() => navigate("/price-list")}
      >
        🛒 Shop Now
      </motion.button>
    </div>
  )
}
