import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {Search,Package,Truck,CheckCircle,Clock,MapPin,Phone,User,Calendar,Download,ChevronDown,ChevronUp,} from "lucide-react"
import Navbar from "../Component/Navbar"
import { API_BASE_URL } from "../../Config"

const Status = () => {
  const [searchForm, setSearchForm] = useState({
    customer_name: "",
    mobile_number: "",
  })
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [expandedTimelines, setExpandedTimelines] = useState({})

  const styles = {
    card: {
      background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
      border: "2px solid #ec4899",
      boxShadow: "0 8px 32px rgba(236, 72, 153, 0.15)",
    },
    button: {
      background: "linear-gradient(135deg, #ec4899, #be185d)",
      border: "2px solid #be185d",
      boxShadow: "0 4px 16px rgba(236, 72, 153, 0.3)",
    },
    input: {
      background: "#ffffff",
      border: "2px solid #f3e8ff",
    },
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "mobile_number") {
      const cleaned = value.replace(/\D/g, "").slice(-10)
      setSearchForm((prev) => ({ ...prev, [name]: cleaned }))
    } else {
      setSearchForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const toggleTimeline = (orderId) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const searchOrders = async () => {
    if (!searchForm.customer_name.trim() || !searchForm.mobile_number.trim()) {
      alert("Please enter both name and mobile number")
      return
    }

    if (searchForm.mobile_number.length !== 10) {
      alert("Please enter a valid 10-digit mobile number")
      return
    }

    setIsLoading(true)
    try {
      const [bookingsRes, quotationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/direct/bookings/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: searchForm.customer_name.trim(),
            mobile_number: searchForm.mobile_number,
          }),
        }),
        fetch(`${API_BASE_URL}/api/direct/quotations/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: searchForm.customer_name.trim(),
            mobile_number: searchForm.mobile_number,
          }),
        }),
      ])

      const [bookingsData, quotationsData] = await Promise.all([bookingsRes.json(), quotationsRes.json()])

      const allOrders = [
        ...(Array.isArray(bookingsData) ? bookingsData.map((order) => ({ ...order, type: "booking" })) : []),
        ...(Array.isArray(quotationsData) ? quotationsData.map((order) => ({ ...order, type: "quotation" })) : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      setOrders(allOrders)
      setHasSearched(true)
    } catch (error) {
      console.error("Error searching orders:", error)
      alert("Error searching orders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-700 bg-yellow-100 border-yellow-300"
      case "confirmed":
        return "text-blue-700 bg-blue-100 border-blue-300"
      case "packed":
        return "text-purple-700 bg-purple-100 border-purple-300"
      case "dispatched":
        return "text-indigo-700 bg-indigo-100 border-indigo-300"
      case "delivered":
        return "text-green-700 bg-green-100 border-green-300"
      case "booked":
        return "text-green-700 bg-green-100 border-green-300"
      case "canceled":
        return "text-red-700 bg-red-100 border-red-300"
      default:
        return "text-gray-700 bg-gray-100 border-gray-300"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "packed":
        return <Package className="w-4 h-4" />
      case "dispatched":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "booked":
        return <CheckCircle className="w-4 h-4" />
      case "canceled":
        return <Clock className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getOrderTimeline = (order) => {
    const timeline = [
      {
        status: "Order Placed",
        date: order.created_at,
        completed: true,
        icon: <Package className="w-4 h-4" />,
      },
    ]

    if (
      order.status === "confirmed" ||
      order.status === "packed" ||
      order.status === "dispatched" ||
      order.status === "delivered" ||
      order.status === "booked"
    ) {
      timeline.push({
        status: "Confirmed",
        date: order.updated_at || order.created_at,
        completed: true,
        icon: <CheckCircle className="w-4 h-4" />,
      })
    }

    if (order.status === "packed" || order.status === "dispatched" || order.status === "delivered") {
      timeline.push({
        status: "Packed",
        date: order.processing_date || order.updated_at,
        completed: true,
        icon: <Package className="w-4 h-4" />,
      })
    }

    if (order.status === "dispatched" || order.status === "delivered") {
      timeline.push({
        status: "Dispatched",
        date: order.dispatch_date || order.updated_at,
        completed: true,
        icon: <Truck className="w-4 h-4" />,
        transport: {
          company: order.transport_name,
          tracking_number: order.lr_number,
          driver_contact: order.transport_contact,
        },
      })
    }

    if (order.status === "delivered") {
      timeline.push({
        status: "Delivered",
        date: order.delivery_date || order.updated_at,
        completed: true,
        icon: <CheckCircle className="w-4 h-4" />,
      })
    }

    return timeline
  }

  const downloadInvoice = async (order) => {
    try {
      const endpoint =
        order.type === "booking"
          ? `/api/direct/invoice/${order.order_id}`
          : `/api/direct/quotation/${order.quotation_id}`

      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${order.customer_name}-${order.order_id || order.quotation_id}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading invoice:", error)
      alert("Error downloading invoice. Please try again.")
    }
  }

  const formatPrice = (price) => {
    const num = Number.parseFloat(price)
    return isNaN(num) ? "0.00" : num.toFixed(2)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Navbar />
      <main className="hundred:pt-48 mobile:pt-34 px-4 sm:px-8 max-w-7xl mx-auto hundred:mt-0 mobile:mt-20 mobile:mb-32 hundred:mb-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mobile:-mt-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-pink-600 drop-shadow-sm">Track Your Orders</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">Enter your details to track your orders</p>
          </div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shadow-lg p-6 mb-8 max-w-md mx-auto"
            style={styles.card}
          >
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="text"
                  name="customer_name"
                  placeholder="Enter your full name"
                  value={searchForm.customer_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                  style={styles.input}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="tel"
                  name="mobile_number"
                  placeholder="Enter your mobile number"
                  value={searchForm.mobile_number}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                  style={styles.input}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={searchOrders}
                disabled={isLoading}
                className="w-full text-white font-semibold py-3 flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
                style={styles.button}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Orders
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Orders List */}
          <AnimatePresence>
            {hasSearched && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
                    <p className="text-gray-500">
                      No orders found with the provided details. Please check your name and mobile number.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-pink-600 mb-6 border-b-4 border-pink-500 pb-2">
                      Your Orders ({orders.length})
                    </h2>
                    {orders.map((order) => (
                      <motion.div
                        key={`${order.type}-${order.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative shadow-lg overflow-hidden"
                        style={styles.card}
                      >
                        <div className="p-6 relative z-10">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-800 drop-shadow-sm">
                                  {order.type === "booking"
                                    ? `Order #${order.order_id}`
                                    : `Quote #${order.quotation_id}`}
                                </h3>
                                <span
                                  className={`px-3 py-1 text-sm font-medium border-2 flex items-center gap-1 ${getStatusColor(order.status)}`}
                                >
                                  {getStatusIcon(order.status)}
                                  {order.status?.toUpperCase() || "PENDING"}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(order.created_at)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {order.district}, {order.state}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4 md:mt-0">
                              <div className="text-right">
                                <p className="text-2xl font-bold text-pink-600">₹{formatPrice(order.total)}</p>
                              </div>
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => downloadInvoice(order)}
                                  className="p-2 text-white bg-green-500 border-2 border-green-600"
                                >
                                  <Download className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleTimeline(`${order.type}-${order.id}`)}
                                  className="p-2 text-white"
                                  style={styles.button}
                                >
                                  {expandedTimelines[`${order.type}-${order.id}`] ? (
                                    <ChevronUp className="w-5 h-5" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5" />
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          {/* Order Timeline */}
                          <AnimatePresence>
                            {expandedTimelines[`${order.type}-${order.id}`] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 overflow-hidden"
                              >
                                <h4 className="text-sm font-semibold text-gray-700 mb-4">Order Timeline</h4>
                                <div className="relative">
                                  {getOrderTimeline(order).map((step, index, array) => (
                                    <div key={index} className="flex items-start gap-4 pb-4 last:pb-0">
                                      <div
                                        className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 ${
                                          step.completed
                                            ? "bg-green-100 text-green-600 border-green-300"
                                            : "bg-gray-100 text-gray-400 border-gray-300"
                                        }`}
                                      >
                                        {step.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <p
                                            className={`text-sm font-medium ${
                                              step.completed ? "text-gray-800" : "text-gray-500"
                                            }`}
                                          >
                                            {step.status}
                                          </p>
                                          {step.date && (
                                            <p className="text-xs text-gray-500">{formatDate(step.date)}</p>
                                          )}
                                        </div>
                                        {step.transport && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            <p>Company: {step.transport.company || "N/A"}</p>
                                            <p>Tracking: {step.transport.tracking_number || "N/A"}</p>
                                            <p>Contact: {step.transport.driver_contact || "N/A"}</p>
                                          </div>
                                        )}
                                      </div>
                                      {index < array.length - 1 && (
                                        <div
                                          className={`absolute left-4 top-8 w-0.5 h-8 ${
                                            step.completed ? "bg-green-200" : "bg-gray-200"
                                          }`}
                                          style={{ marginTop: "0px" }}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div
                          className="absolute bottom-0 left-0 right-0 h-px opacity-60"
                          style={{
                            background: "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.6), transparent)",
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}

export default Status
