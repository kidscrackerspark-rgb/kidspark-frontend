import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaPlus, FaMinus, FaArrowLeft, FaArrowRight, FaInfoCircle, FaTimes, FaShoppingCart } from "react-icons/fa"
import Navbar from "../Component/Navbar"
import { API_BASE_URL } from "../../Config"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import need from "../default.jpg"
import "../App.css"

const BigFireworkAnimation = ({ delay = 0 }) => {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
  const burstPosition = { x: screenWidth * 0.5, y: screenHeight * 0.5 }
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <motion.div
        className="absolute"
        style={{ left: burstPosition.x, top: burstPosition.y, transform: "translate(-50%, -50%)" }}
      >
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: `hsl(${(i * 15) % 360}, 80%, 65%)`,
              boxShadow: `0 0 20px hsl(${(i * 15) % 360}, 80%, 65%)`,
            }}
            animate={{
              x: Math.cos(i * 11.25 * (Math.PI / 180)) * screenWidth * 0.4,
              y: Math.sin(i * 11.25 * (Math.PI / 180)) * screenWidth * 0.4,
              opacity: [1, 0.8, 0],
              scale: [1, 1.2, 0],
            }}
            transition={{ duration: 4, delay, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: "radial-gradient(circle, #ffd93d 0%, #ff6b6b66 30%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 100px #ffd93d",
          }}
          animate={{ scale: [0, 4, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 4, delay, ease: "easeOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full border-4"
          style={{ margin: "-192px 0 0 -192px", borderColor: "#ffd93d", boxShadow: "0 0 60px #ffd93d" }}
          animate={{ scale: [0, 3, 4], opacity: [0, 0.8, 0] }}
          transition={{ duration: 4, delay: delay + 0.2, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  )
}

const Loader = ({ showWarning }) => (
  <div className="fixed inset-0 bg-white/90 z-70 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="loader-spinner w-16 h-16 border-4 border-t-pink-500 border-gray-200 rounded-full animate-spin"></div>
      <p className="text-lg font-semibold text-pink-700">
        {showWarning ? "Your network is slow. Please check your internet and try again." : "Loading products..."}
      </p>
    </motion.div>
  </div>
)

const ImageModal = ({ media, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const videoRef = useRef(null)

  const mediaItems = useMemo(() => {
    const items = media && typeof media === "string" ? JSON.parse(media) : Array.isArray(media) ? media : []
    return items.sort((a, b) => {
      const aStr = typeof a === "string" ? a : ""
      const bStr = typeof b === "string" ? b : ""
      const isAVideo = aStr.includes("/video/") || aStr.startsWith("data:video/")
      const isBVideo = bStr.includes("/video/") || bStr.startsWith("data:video/")
      const isAGif = aStr.startsWith("data:image/gif") || aStr.toLowerCase().endsWith(".gif")
      const isBGif = bStr.startsWith("data:image/gif") || bStr.toLowerCase().endsWith(".gif")
      const isAImage = aStr.startsWith("data:image/") && !isAGif
      const isBImage = bStr.startsWith("data:image/") && !isBGif
      return (isAImage ? 0 : isAVideo ? 1 : isAGif ? 2 : 3) - (isBImage ? 0 : isBVideo ? 1 : isBGif ? 2 : 3)
    })
  }, [media])

  const isVideo = (media) => typeof media === "string" && (media.includes("/video/") || media.startsWith("data:video/"))

  const renderMedia = (media, idx) => {
    const src = typeof media === "string" ? media : ""
    if (isVideo(src)) {
      return (
        <video
          key={idx}
          ref={videoRef}
          src={src}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-contain rounded-xl"
          onError={(e) => console.error("Video load error in modal:", e)}
          onLoad={() => {
            if (videoRef.current) {
              videoRef.current.load()
              videoRef.current.play().catch((err) => console.error("Video playback error in modal:", err))
            }
          }}
        />
      )
    }
    return <img key={idx} src={src || need} alt={`media-${idx}`} className="w-full h-full object-contain rounded-xl" />
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    if (videoRef.current && isVideo(mediaItems[currentIndex])) {
      videoRef.current.load()
      videoRef.current.play().catch((err) => console.error("Video playback error:", err))
    }
  }, [currentIndex, mediaItems])

  if (!mediaItems || mediaItems.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-4xl w-full h-[80vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl z-10 hover:text-red-400"
          aria-label="Close image modal"
        >
          <FaTimes />
        </button>
        {renderMedia(mediaItems[currentIndex], currentIndex)}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-sky-700 flex items-center justify-center text-xl z-10 hover:bg-sky-700 hover:text-white"
              aria-label="Previous media"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-sky-700 flex items-center justify-center text-xl z-10 hover:bg-sky-700 hover:text-white"
              aria-label="Next media"
            >
              <FaArrowRight />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {mediaItems.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-sky-700" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

const Carousel = ({ media, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const videoRef = useRef(null)

  const mediaItems = useMemo(() => {
    const items = media && typeof media === "string" ? JSON.parse(media) : Array.isArray(media) ? media : []
    return items.sort((a, b) => {
      const aStr = typeof a === "string" ? a : ""
      const bStr = typeof b === "string" ? b : ""
      const isAVideo = aStr.includes("/video/") || aStr.startsWith("data:video/")
      const isBVideo = bStr.includes("/video/") || bStr.startsWith("data:video/")
      const isAGif = aStr.startsWith("data:image/gif") || aStr.toLowerCase().endsWith(".gif")
      const isBGif = bStr.startsWith("data:image/gif") || bStr.toLowerCase().endsWith(".gif")
      const isAImage = !isAVideo && !isAGif
      const isBImage = !isBVideo && !isBGif
      return (isAImage ? 0 : isAVideo ? 1 : isAGif ? 2 : 3) - (isBImage ? 0 : isBVideo ? 1 : isBGif ? 2 : 3)
    })
  }, [media])

  const isVideo = (media) => typeof media === "string" && (media.includes("/video/") || media.startsWith("data:video/"))

  const renderMedia = (media, idx) => {
    const src = typeof media === "string" ? media : ""
    if (isVideo(src)) {
      return (
        <video
          key={idx}
          ref={videoRef}
          src={src}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-contain p-2"
          onError={(e) => console.error("Video load error:", e)}
          onLoad={() => {
            if (videoRef.current) {
              videoRef.current.load()
              videoRef.current.play().catch((err) => console.error("Video playback error:", err))
            }
          }}
        />
      )
    }
    return (
      <img
        key={idx}
        src={src || need}
        alt={`media-${idx}`}
        className="w-full h-full object-contain p-2 cursor-pointer"
        onClick={onImageClick}
      />
    )
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
  }

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

  useEffect(() => {
    if (videoRef.current && isVideo(mediaItems[currentIndex])) {
      videoRef.current.load()
      videoRef.current.play().catch((err) => console.error("Video playback error:", err))
    }
  }, [currentIndex, mediaItems])

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="w-full h-30 rounded-2xl mb-4 overflow-hidden bg-pink-300 flex items-center justify-center">
        <img src={need || "/placeholder.svg"} alt="Default product" />
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-40 rounded-2xl mb-4 overflow-hidden select-none"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(240,249,255,0.4))",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(2,132,199,0.2)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {renderMedia(mediaItems[currentIndex], currentIndex)}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="mobile:hidden sm:flex absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-pink-700 flex items-center justify-center text-lg z-10 hover:bg-pink-700 hover:text-white cursor-pointer"
            style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
            aria-label="Previous media"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="mobile:hidden sm:flex absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-pink-700 flex items-center justify-center text-lg z-10 hover:bg-pink-700 hover:text-white cursor-pointer"
            style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
            aria-label="Next media"
          >
            <FaArrowRight />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
            {mediaItems.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-pink-700" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const Pricelist = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    customer_name: "",
    address: "",
    district: "",
    state: "",
    mobile_number: "",
    email: "",
    customer_type: "User",
  })
  const [selectedType, setSelectedType] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [promocode, setPromocode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [promocodes, setPromocodes] = useState([])
  const [originalTotal, setOriginalTotal] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showNetworkWarning, setShowNetworkWarning] = useState(false)
  const debounceTimeout = useRef(null)
  const loadingTimeout = useRef(null)

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  const styles = {
    card: {
      border: "2px solid #be185d",
      boxShadow: "0 8px 25px rgba(236, 72, 153, 0.3)",
    },
    button: {
      background: "linear-gradient(135deg, #be185d, #ec4899)",
      border: "2px solid #be185d",
      boxShadow: "0 6px 20px rgba(190, 24, 93, 0.4)",
    },
    input: {
      background: "white",
      border: "2px solid #ec4899",
    },
    modal: {
      background: "white",
      border: "3px solid #be185d",
      boxShadow: "0 15px 35px rgba(236, 72, 153, 0.3)",
    },
  }

  const formatPrice = (price) => {
    const num = Number.parseFloat(price) || 0
    return Number.isInteger(num) ? num.toString() : num.toFixed(2)
  }

  const capitalize = (str) =>
    str
      ? str
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : ""

  const downloadPDF = async () => {
    try {
      const productsRes = await fetch(`${API_BASE_URL}/api/products`)
      const productsData = await productsRes.json()

      const naturalSort = (a, b) => {
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base",
        })
        return collator.compare(a.productname, b.productname)
      }

      const serialSort = (a, b) => {
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base",
        })
        return collator.compare(a.serial_number, b.serial_number)
      }

      const seenSerials = new Set()
      const normalizedProducts = productsData.data
        .filter((p) => {
          if (seenSerials.has(p.serial_number)) {
            console.warn(`Duplicate serial_number found: ${p.serial_number}`)
            return false
          }
          seenSerials.add(p.serial_number)
          return p.status === "on"
        })
        .map((product) => ({
          ...product,
          images: product.image ? (typeof product.image === "string" ? JSON.parse(product.image) : product.image) : [],
          price: Number.parseFloat(product.price) || 0,
          discount: Number.parseFloat(product.discount) || 0,
        }))
        .sort(naturalSort)

      if (!normalizedProducts.length) {
        showError("No products available to export")
        return
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      let yOffset = 20

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("KIDS CRACKERS PARK", pageWidth / 2, yOffset, { align: "center" })
      yOffset += 10
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Website - kidscrackerspark.vercel.app", pageWidth / 2, yOffset, { align: "center" })
      yOffset += 10
      doc.text("Retail Pricelist - 2025", pageWidth / 2, yOffset, { align: "center" })
      yOffset += 20

      const tableData = []
      let slNo = 1
      const orderedTypes = [
        "One sound crackers",
        "Ground Chakkar",
        "Flower Pots",
        "Twinkling Star",
        "Rockets",
        "Bombs",
        "Kids Collections And Varities",
        "Repeating Shots",
        "Comets Sky Shots",
        "Fancy pencil varieties",
        "Fountain and Fancy Novelties",
        "Matches",
        "Guns and Caps",
        "Sparklers",
        "Gift Boxes",
      ]

      orderedTypes.forEach((type) => {
        const typeKey = type.replace(/ /g, "_").toLowerCase()
        const typeProducts = normalizedProducts
          .filter((product) => product.product_type.toLowerCase() === typeKey)
          .sort(serialSort)
        if (typeProducts.length > 0) {
          tableData.push([
            { content: type, colSpan: 6, styles: { fontStyle: "bold", halign: "left", fillColor: [200, 200, 200] } },
          ])
          tableData.push(["Sl No.", "Prod No.", "Product Name", "Rate", "Discounted Rate", "Per"])
          typeProducts.forEach((product) => {
            const dis = product.price * (product.discount / 100)
            const discountedRate = product.price - dis
            tableData.push([
              slNo++,
              product.serial_number,
              product.productname,
              `Rs.${formatPrice(product.price)}`,
              `Rs.${formatPrice(discountedRate)}`,
              product.per,
            ])
          })
          tableData.push([])
        }
      })

      autoTable(doc, {
        startY: yOffset,
        head: [["Sl No.", "Prod No.", "Product Name", "Rate", "Discounted Rate", "Per"]],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 20 },
          2: { cellWidth: 70 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25 },
        },
        didDrawCell: (data) => {
          if (data.row.section === "body" && data.cell.raw && data.cell.raw.colSpan === 5) {
            data.cell.styles.cellPadding = 5
            data.cell.styles.fontSize = 12
          }
        },
      })

      doc.save("KCP_Pricelist_2025.pdf")
    } catch (err) {
      showError("Failed to generate PDF: " + err.message)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
        loadingTimeout.current = setTimeout(() => {
          setShowNetworkWarning(true)
        }, 5000)

        const savedCart = localStorage.getItem("firecracker-cart")
        if (savedCart) setCart(JSON.parse(savedCart))
        const [statesRes, productsRes, promocodesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/locations/states`),
          fetch(`${API_BASE_URL}/api/products`),
          fetch(`${API_BASE_URL}/api/promocodes`),
        ])
        const [statesData, productsData, promocodesData] = await Promise.all([
          statesRes.json(),
          productsRes.json(),
          promocodesRes.json(),
        ])
        setStates(Array.isArray(statesData) ? statesData : [])

        const naturalSort = (a, b) => {
          const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: "base",
          })
          return collator.compare(a.productname, b.productname)
        }

        const seenSerials = new Set()
        const normalizedProducts = productsData.data
          .filter((p) => {
            if (p.status !== "on") return false
            if (seenSerials.has(p.serial_number)) {
              console.warn(`Duplicate serial_number found: ${p.serial_number}`)
              return false
            }
            seenSerials.add(p.serial_number)
            return true
          })
          .map((product) => ({
            ...product,
            images: product.image
              ? typeof product.image === "string"
                ? JSON.parse(product.image)
                : product.image
              : [],
          }))
          .sort(naturalSort)

        setProducts(normalizedProducts)
        setPromocodes(Array.isArray(promocodesData) ? promocodesData : [])
        setIsLoading(false)
        clearTimeout(loadingTimeout.current)
      } catch (err) {
        console.error("Error loading initial data:", err)
        toast.error("Failed to load initial data", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        setIsLoading(false)
        clearTimeout(loadingTimeout.current)
      }
    }
    initializeData()

    return () => {
      if (loadingTimeout.current) clearTimeout(loadingTimeout.current)
    }
  }, [])

  useEffect(() => {
    if (customerDetails.state) {
      fetch(`${API_BASE_URL}/api/locations/states/${customerDetails.state}/districts`)
        .then((res) => res.json())
        .then((data) => setDistricts(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error("Error fetching districts:", err)
          toast.error("Failed to load districts", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        })
    }
  }, [customerDetails.state])

  useEffect(() => localStorage.setItem("firecracker-cart", JSON.stringify(cart)), [cart])

  const addToCart = useCallback((product) => {
    if (!product?.serial_number) {
      toast.error("Invalid product or missing serial_number", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }
    setCart((prev) => ({ ...prev, [product.serial_number]: (prev[product.serial_number] || 0) + 1 }))
  }, [])

  const removeFromCart = useCallback((product) => {
    if (!product?.serial_number) {
      toast.error("Invalid product or missing serial_number", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }
    setCart((prev) => {
      const count = (prev[product.serial_number] || 1) - 1
      const updated = { ...prev }
      if (count <= 0) delete updated[product.serial_number]
      else updated[product.serial_number] = count
      return updated
    })
  }, [])

  const handleFinalCheckout = async () => {
    setIsBooking(true)
    const order_id = `ORD-${Date.now()}`
    const selectedProducts = Object.entries(cart).map(([serial, qty]) => {
      const product = products.find((p) => p.serial_number === serial)
      return {
        id: product.id,
        product_type: product.product_type,
        quantity: qty,
        per: product.per,
        image: product.image,
        price: product.price,
        discount: product.discount,
        serial_number: product.serial_number,
        productname: product.productname,
        status: product.status,
      }
    })
    if (!selectedProducts.length) {
      setIsBooking(false)
      return showError("Your cart is empty.")
    }
    if (!customerDetails.customer_name.trim()) {
      setIsBooking(false)
      return showError("Customer name is required.")
    }
    if (!customerDetails.address.trim()) {
      setIsBooking(false)
      return showError("Address is required.")
    }
    if (!customerDetails.district.trim()) {
      setIsBooking(false)
      return showError("District is required.")
    }
    if (!customerDetails.state.trim()) {
      setIsBooking(false)
      return showError("Please select a state.")
    }
    if (!customerDetails.mobile_number.trim()) {
      setIsBooking(false)
      return showError("Mobile number is required.")
    }
    const mobile = customerDetails.mobile_number.replace(/\D/g, "").slice(-10)
    if (mobile.length !== 10) {
      setIsBooking(false)
      return showError("Mobile number must be 10 digits.")
    }
    if (customerDetails.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      setIsBooking(false)
      return showError("Please enter a valid email address.")
    }
    const selectedState = customerDetails.state.trim()
    const minOrder = states.find((s) => s.name === selectedState)?.min_rate
    if (minOrder && Number.parseFloat(totals.total) < minOrder) {
      setIsBooking(false)
      return showError(`Minimum order for ${selectedState} is ₹${minOrder}. Your total is ₹${totals.total}.`)
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/direct/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id,
          products: selectedProducts,
          net_rate: Number.parseFloat(totals.net),
          you_save: Number.parseFloat(totals.save),
          total: Number.parseFloat(totals.total),
          promo_discount: Number.parseFloat(totals.promo_discount || "0.00"),
          customer_type: customerDetails.customer_type,
          customer_name: customerDetails.customer_name,
          address: customerDetails.address,
          mobile_number: mobile,
          email: customerDetails.email,
          district: customerDetails.district,
          state: customerDetails.state,
          promocode: appliedPromo?.code || null,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 4000)
        setCart({})
        setAppliedPromo(null)
        setPromocode("")
        setIsCartOpen(false)
        setShowModal(false)
        setCustomerDetails({
          customer_name: "",
          address: "",
          district: "",
          state: "",
          mobile_number: "",
          email: "",
          customer_type: "User",
        })
        setOriginalTotal(0)
        setTotalDiscount(0)

        const pdfResponse = await fetch(`${API_BASE_URL}/api/direct/invoice/${data.order_id}`, { responseType: "blob" })
        const blob = await pdfResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        const safeCustomerName = (customerDetails.customer_name || "unknown")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "")
        link.setAttribute("download", `${safeCustomerName}-${data.order_id}.pdf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast.success("Downloaded estimate bill, check downloads", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        showError(data.message || "Booking failed. Please try again.")
      }
    } catch (err) {
      console.error("Checkout error:", err)
      showError("Something went wrong during checkout. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  const showError = (message) => {
    setErrorMessage(message)
    setShowErrorModal(true)
    setTimeout(() => setShowErrorModal(false), 5000)
  }

  const handleCheckoutClick = () => {
    Object.keys(cart).length ? (setShowModal(true), setIsCartOpen(false)) : showError("Your cart is empty.")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "mobile_number") {
      const cleaned = value.replace(/\D/g, "").slice(-10)
      setCustomerDetails((prev) => ({ ...prev, [name]: cleaned }))
    } else {
      setCustomerDetails((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleShowDetails = useCallback((product) => {
    setSelectedProduct(product)
    setShowDetailsModal(true)
  }, [])

  const handleCloseDetails = useCallback(() => {
    setSelectedProduct(null)
    setShowDetailsModal(false)
  }, [])

  const handleShowImage = useCallback((product) => {
    setSelectedProduct(product)
    setShowImageModal(true)
  }, [])

  const handleCloseImage = useCallback(() => {
    setSelectedProduct(null)
    setShowImageModal(false)
  }, [])

  const totals = useMemo(() => {
    let net = 0,
      save = 0,
      total = 0,
      productDiscount = 0,
      promoDiscount = 0
    for (const serial in cart) {
      const qty = cart[serial]
      const product = products.find((p) => p.serial_number === serial)
      if (!product) continue
      const originalPrice = Number.parseFloat(product.price) || 0
      const discount = originalPrice * (Number.parseFloat(product.discount) / 100 || 0)
      const priceAfterProductDiscount = originalPrice - discount
      net += originalPrice * qty
      productDiscount += discount * qty
      let itemTotal = priceAfterProductDiscount * qty

      if (appliedPromo) {
        const promoDiscountRate = Number.parseFloat(appliedPromo.discount) || 0
        const isApplicable = !appliedPromo.product_type || product.product_type === appliedPromo.product_type
        if (isApplicable) {
          const promoDiscountAmount = (itemTotal * promoDiscountRate) / 100
          promoDiscount += promoDiscountAmount
          itemTotal -= promoDiscountAmount
        }
      }
      total += itemTotal
    }
    save = productDiscount + promoDiscount
    return {
      net: formatPrice(net),
      save: formatPrice(save),
      total: formatPrice(total),
      promo_discount: formatPrice(promoDiscount),
      product_discount: formatPrice(productDiscount),
    }
  }, [cart, products, appliedPromo])

  const handleApplyPromo = useCallback(
    async (code) => {
      if (!code) {
        setAppliedPromo(null)
        setPromocode("")
        return
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/promocodes`)
        const promos = await res.json()
        const found = promos.find((p) => p.code.toLowerCase() === code.toLowerCase())

        if (!found) {
          showError("Invalid promocode.")
          setAppliedPromo(null)
          setPromocode("")
          return
        }

        if (found.min_amount && Number.parseFloat(totals.total) < found.min_amount) {
          showError(`Minimum order amount for this promocode is ₹${found.min_amount}. Your total is ₹${totals.total}.`)
          setAppliedPromo(null)
          setPromocode("")
          return
        }

        if (found.end_date && new Date(found.end_date) < new Date()) {
          showError("This promocode has expired.")
          setAppliedPromo(null)
          setPromocode("")
          return
        }

        if (found.product_type) {
          const cartProductTypes = Object.keys(cart).map((serial) => {
            const product = products.find((p) => p.serial_number === serial)
            return product?.product_type || "Others"
          })
          if (!cartProductTypes.some((type) => type === found.product_type)) {
            showError(
              `This promocode is only valid for ${found.product_type.replace(/_/g, " ")} products, and none are in your cart.`,
            )
            setAppliedPromo(null)
            setPromocode("")
          }
        }

        setAppliedPromo(found)
        toast.success(`Promocode ${found.code} applied successfully! Discount: ${found.discount}%`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } catch (err) {
        console.error("Promo apply error:", err)
        showError("Could not validate promocode.")
        setAppliedPromo(null)
        setPromocode("")
      }
    },
    [cart, products, totals.total],
  )

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      if (promocode && promocode !== "custom") handleApplyPromo(promocode)
      else if (promocode === "custom") {
      } else {
        setAppliedPromo(null)
      }
    }, 500)
    return () => clearTimeout(debounceTimeout.current)
  }, [promocode, handleApplyPromo])

  const productTypes = useMemo(() => {
    const orderedTypes = [
      "One sound crackers",
      "Ground Chakkar",
      "Flower Pots",
      "Twinkling Star",
      "Rockets",
      "Bombs",
      "Kids Collections And Varities",
      "Repeating Shots",
      "Comets Sky Shots",
      "Fancy pencil varieties",
      "Fountain and Fancy Novelties",
      "Matches",
      "Guns and Caps",
      "Sparklers",
      "Gift Boxes",
    ]
    const availableTypes = [
      ...new Set(products.filter((p) => p.product_type !== "gift_box_dealers").map((p) => p.product_type || "Others")),
    ]
    const filteredOrderedTypes = orderedTypes.filter((type) =>
      availableTypes.includes(type.replace(/ /g, "_").toLowerCase()),
    )
    return ["All", ...filteredOrderedTypes]
  }, [products])

  const grouped = useMemo(() => {
    const orderedTypes = [
      "One sound crackers",
      "Ground Chakkar",
      "Flower Pots",
      "Twinkling Star",
      "Rockets",
      "Bombs",
      "Kids Collections And Varities",
      "Repeating Shots",
      "Comets Sky Shots",
      "Fancy pencil varieties",
      "Fountain and Fancy Novelties",
      "Matches",
      "Guns and Caps",
      "Sparklers",
      "Gift Boxes",
    ]
    const result = products
      .filter(
        (p) =>
          p.product_type !== "gift_box_dealers" &&
          (selectedType === "All" || p.product_type === selectedType.replace(/ /g, "_").toLowerCase()) &&
          (!searchTerm ||
            p.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.serial_number.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .reduce((acc, p) => {
        const key = p.product_type || "Others"
        acc[key] = acc[key] || []
        acc[key].push(p)
        return acc
      }, {})
    const orderedResult = {}
    orderedTypes
      .map((type) => type.replace(/ /g, "_").toLowerCase())
      .forEach((type) => {
        if (result[type]) {
          orderedResult[type] = result[type]
        }
      })
    return orderedResult
  }, [products, selectedType, searchTerm])

  if (isLoading) {
    return (
      <>
        <ToastContainer />
        <Loader showWarning={showNetworkWarning} />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      {isCartOpen && <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setIsCartOpen(false)} />}
      {showSuccess && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-60 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BigFireworkAnimation delay={0} />
          <motion.div
            className="flex flex-col items-center gap-4 z-10"
            style={{ background: "none" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.h2
              className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 bg-clip-text text-transparent"
              style={{ textShadow: "0 0 20px rgba(236, 72, 153, 0.8), 0 0 40px rgba(236, 72, 153, 0.5)" }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: 1, delay: 0.5 }}
            >
              Booked
            </motion.h2>
          </motion.div>
        </motion.div>
      )}
      {showErrorModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-60 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-red-200 text-red-400 border-2 text-lg font-semibold p-6 max-w-md mx-4 text-center shadow-lg">
            {errorMessage}
          </div>
        </motion.div>
      )}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center details-modal">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative shadow-lg max-w-md w-full mx-4 overflow-hidden"
            style={styles.modal}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-pink-700 drop-shadow-sm">{selectedProduct.productname}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-600 hover:text-red-500 text-xl cursor-pointer"
                  aria-label="Close details modal"
                >
                  ×
                </button>
              </div>
              <Carousel media={selectedProduct.image} onImageClick={() => handleShowImage(selectedProduct)} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-slate-800">Description</h3>
                <p className="text-sm text-slate-600 mt-2">
                  {selectedProduct.description || "No description available."}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseDetails}
                  className="px-6 py-3 text-sm font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ background: styles.button.background, boxShadow: "0 10px 25px rgba(190, 24, 93, 0.3)" }}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {showImageModal && selectedProduct && (
        <AnimatePresence>
          <ImageModal media={selectedProduct.image} onClose={handleCloseImage} />
        </AnimatePresence>
      )}
      <main
        className={`relative pt-28 px-4 sm:px-8 max-w-7xl mx-auto transition-all duration-300 ${isCartOpen ? "mr-80" : ""}`}
      >
        <section className="px-4 py-3 shadow-inner flex justify-between flex-wrap gap-4 text-sm sm:text-base border-2 border-pink-500 bg-gradient-to-br from-pink-400/80 to-pink-600/90 text-white font-semibold">
          <div>Net Rate: ₹{totals.net}</div>
          <div>You Save: ₹{totals.save}</div>
          {appliedPromo && (
            <div>
              Promocode ({appliedPromo.code}): -₹{totals.promo_discount}
            </div>
          )}
          <div className="font-bold">Total: ₹{totals.total}</div>
        </section>
        <div className="flex justify-center gap-4 mb-8 mt-8">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
            style={styles.input}
          >
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by name or serial number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 w-1/2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
            style={styles.input}
          />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadPDF}
            className="px-8 py-3 text-sm font-semibold text-white transition-all duration-300 cursor-pointer"
            style={{ background: styles.button.background, boxShadow: "0 10px 25px rgba(190, 24, 93, 0.3)" }}
          >
            Download Pricelist
          </motion.button>
        </motion.div>
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mt-12 mb-10">
            <h2 className="text-3xl text-pink-800 mb-5 font-semibold capitalize border-b-4 border-pink-500 pb-2">
              {type.replace(/_/g, " ")}
            </h2>
            <div className="grid mobile:grid-cols-2 onefifty:grid-cols-3 hundred:grid-cols-4 gap-6">
              {items.map((product) => {
                if (!product) return null
                const originalPrice = Number.parseFloat(product.price)
                const discount = originalPrice * (product.discount / 100)
                const finalPrice =
                  product.discount > 0 ? formatPrice(originalPrice - discount) : formatPrice(originalPrice)
                const count = cart[product.serial_number] || 0
                return (
                  <motion.div
                    key={product.serial_number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative p-6 overflow-hidden cursor-pointer transition-all duration-500"
                    style={styles.card}
                  >
                    {product.discount > 0 && (
                      <div className="absolute left-2 top-2 bg-red-500 text-white text-md font-bold px-2 py-1 mobile:text-[10px] mobile:px-1.5 mobile:py-0.5">
                        {product.discount}%
                      </div>
                    )}
                    <motion.button
                      onClick={() => handleShowDetails(product)}
                      className="absolute cursor-pointer right-2 top-2 bg-pink-500 text-white mobile:text-md hundred:text-2xl font-bold hundred:w-8 hundred:h-8 mobile:w-6 mobile:h-6 flex items-center justify-center hover:bg-pink-700 transition-all duration-300 z-20 pointer-events-auto"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="View product details"
                    >
                      <FaInfoCircle />
                    </motion.button>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                    <div className="relative z-10 mobile:mt-2">
                      <p className="text-lg mobile:text-sm font-bold text-black group-hover:text-pink-500 transition-colors duration-500 drop-shadow-sm line-clamp-2 mb-2">
                        {product.productname}
                      </p>
                      <div className="space-y-1 mb-4">
                        {product.discount > 0 ? (
                          <>
                            <p className="text-sm text-black line-through">MRP: ₹{formatPrice(originalPrice)}</p>
                            <p className="text-xl font-bold text-black group-hover:text-pink-500 transition-colors duration-500">
                              ₹{finalPrice} / {product.per}
                            </p>
                          </>
                        ) : (
                          <p className="text-xl font-bold text-black group-hover:text-pink-500 transition-colors duration-500">
                            ₹{finalPrice} / {product.per}
                          </p>
                        )}
                      </div>
                      <Carousel media={product.image} onImageClick={() => handleShowImage(product)} />
                      <div className="relative min-h-[3rem] flex items-end justify-end">
                        <AnimatePresence mode="wait">
                          {count > 0 ? (
                            <motion.div
                              key="quantity-controls"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="flex items-center justify-between w-full p-2"
                              style={styles.button}
                            >
                              <motion.button
                                onClick={() => removeFromCart(product)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 cursor-pointer bg-white/20 text-white font-bold text-lg flex items-center justify-center transition-all duration-300"
                              >
                                <FaMinus />
                              </motion.button>
                              <span className="text-white font-bold text-lg px-4 drop-shadow-lg w-16 text-center">
                                {count}
                              </span>
                              <motion.button
                                onClick={() => addToCart(product)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 cursor-pointer bg-white/20 text-white font-bold text-lg flex items-center justify-center transition-all duration-300"
                              >
                                <FaPlus />
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="add-button"
                              onClick={() => addToCart(product)}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="w-12 h-12 cursor-pointer text-white font-bold text-xl flex items-center justify-center shadow-lg relative overflow-hidden"
                              style={styles.button}
                            >
                              <motion.div
                                className="absolute inset-0"
                                initial={{ scale: 0, opacity: 0.5 }}
                                whileTap={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                style={{ background: "rgba(255,255,255,0.3)" }}
                              />
                              <FaPlus />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-px opacity-60"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(190, 24, 93, 0.6), transparent)" }}
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative shadow-lg max-w-7xl tab:max-w-md onefifty:max-w-4xl w-full mx-4 overflow-hidden"
            style={styles.modal}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-pink-700 drop-shadow-sm">Enter Customer Details</h2>
              <div className="space-y-4 grid hundred:grid-cols-2 onefifty:grid-cols-2 onefifty:gap-2 mobile:grid-cols-1">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={customerDetails.customer_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile_number"
                    name="mobile_number"
                    value={customerDetails.mobile_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={customerDetails.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={customerDetails.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                    style={styles.input}
                  >
                    <option value="">Select a State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={customerDetails.district}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                    style={styles.input}
                    disabled={!customerDetails.state}
                  >
                    <option value="">Select a District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="text-gray-900 font-semibold">₹{totals.net}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">You Save:</span>
                    <span className="text-green-600 font-semibold">- ₹{totals.save}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Promocode Discount:</span>
                      <span className="text-green-600 font-semibold">- ₹{totals.promo_discount}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-lg">Total:</span>
                    <span className="text-gray-900 font-bold text-lg">₹{totals.total}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalCheckout}
                  disabled={isBooking}
                  className="px-4 py-2 text-sm font-medium text-white transition-all duration-300 cursor-pointer disabled:opacity-50"
                  style={{ background: styles.button.background, boxShadow: "0 10px 25px rgba(190, 24, 93, 0.3)" }}
                >
                  {isBooking ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <aside
        className={`fixed top-0 bottom-0 right-0 w-80 bg-white shadow-lg z-40 transition-transform duration-300 transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-pink-700 drop-shadow-sm">Your Cart</h2>
          {Object.keys(cart).length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {Object.entries(cart).map(([serial, qty]) => {
                  const product = products.find((p) => p.serial_number === serial)
                  if (!product) return null
                  const originalPrice = Number.parseFloat(product.price)
                  const discount = originalPrice * (product.discount / 100)
                  const finalPrice = originalPrice - discount
                  return (
                    <li key={serial} className="py-2 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-gray-800">{product.productname}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(product)} className="text-pink-500 hover:text-pink-700">
                          <FaMinus />
                        </button>
                        <span className="text-gray-600">{qty}</span>
                        <button onClick={() => addToCart(product)} className="text-pink-500 hover:text-pink-700">
                          <FaPlus />
                        </button>
                      </div>
                      <span className="text-gray-600">₹{formatPrice(qty * finalPrice)}</span>
                    </li>
                  )
                })}
              </ul>
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">All States - Minimum Rates</h3>
                <div className="max-h-32 overflow-y-auto">
                  {states.map((state, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center py-1 px-2 text-xs rounded ${
                        customerDetails.state === state.name ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-600"
                      }`}
                    >
                      <span>{state.name}</span>
                      <span className="font-medium">₹{state.min_rate}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mb-4 mt-6">
                <span className="text-gray-700 font-semibold">Subtotal</span>
                <span className="text-gray-900 font-bold">₹{totals.net}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-semibold">Discount</span>
                <span className="text-green-600 font-bold">- ₹{totals.save}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-semibold">Promocode ({appliedPromo.code})</span>
                  <span className="text-green-600 font-bold">- ₹{totals.promo_discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-semibold">Total</span>
                <span className="text-gray-900 font-bold">₹{totals.total}</span>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="px-4 py-2 text-sm font-medium text-white transition-all duration-300 cursor-pointer"
                  style={{ background: styles.button.background, boxShadow: "0 10px 25px rgba(190, 24, 93, 0.3)" }}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      <motion.button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-pink-500 text-white font-bold text-xl flex items-center justify-center shadow-lg z-30 hover:bg-pink-600 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ boxShadow: "0 10px 25px rgba(190, 24, 93, 0.3)" }}
      >
        <div className="relative">
          <FaShoppingCart className="text-2xl" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </motion.button>
    </>
  )
}

export default Pricelist