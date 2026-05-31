import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import Navbar from "../components/navbar"

const Order = () => {
  const navi = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user?._id

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    axios.get(`${import.meta.env.VITE_API_URL}/api/order/${userId}`)
      .then((res) => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err.message)
        setLoading(false)
      })
  }, [])

  const getStatusColor = (status) => {
    if (status === "Delivered") return "#3cdca0"
    if (status === "On the Way") return "#ffc850"
    if (status === "Preparing") return "#ff6464"
    return "var(--muted)"
  }

  const getStatusIcon = (status) => {
    if (status === "Delivered") return "ti-circle-check"
    if (status === "On the Way") return "ti-bike"
    if (status === "Preparing") return "ti-chef-hat"
    return "ti-clock"
  }

  return (
    <div className="page grain" style={{ padding: "24px 20px 130px" }}>
      {/* Header */}
      <motion.span
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
        className="text-4xl font-bold text-white"
      >
        Pizz<span style={{ color: "var(--orange)" }}>A</span> Pala
        <span style={{ color: "var(--orange)" }}>C</span>
        <span style={{ color: "var(--orange)" }}>e</span>
      </motion.span>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button className="back-btn" onClick={() => navi('/account')}>← Back</button>
        <h1 className="section-title">My <span>Orders</span></h1>
      </div>
      <p><span style={{color:"var(--orange)"}}> Note</span> :- After ordering no cancelation will be available</p>
      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", marginTop: 60, color: "var(--muted)" }}>
          <p>Loading orders...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 60, color: "var(--muted)" }}>
          <i className="ti ti-receipt-off" style={{ fontSize: 48, display: "block", marginBottom: 12 }} />
          <p>No orders yet</p>
          <button
            className="btn-primary"
            style={{ marginTop: 20, cursor: "pointer" }}
            onClick={() => navi('/home')}>
            Order Now →
          </button>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ padding: 16 }}
            >
              {/* Order Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem" }}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 2 }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                </div>
                {/* Status Badge */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--bg3)", borderRadius: 20,
                  padding: "4px 12px", border: `1px solid ${getStatusColor(order.status)}`
                }}>
                  <i className={`ti ${getStatusIcon(order.status)}`}
                    style={{ color: getStatusColor(order.status), fontSize: "0.85rem" }} />
                  <span style={{ color: getStatusColor(order.status), fontSize: "0.8rem", fontWeight: 600 }}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--border)", margin: "10px 0" }} />

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {order.orderDetails.map((item, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }}
                      />
                      <span style={{ fontSize: "0.85rem" }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--border)", margin: "10px 0" }} />

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Total Paid</span>
                <span style={{ fontFamily: "var(--font-display)", color: "var(--orange)", fontSize: "1rem" }}>
                  ₹{order.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Navbar />
    </div>
  )
}

export default Order