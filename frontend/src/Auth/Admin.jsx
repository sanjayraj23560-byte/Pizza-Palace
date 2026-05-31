import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"

const STATUS_OPTIONS = ["Pending", "Preparing", "On the Way", "Delivered"]

const getStatusColor = (status) => {
    if (status === "Delivered") return "#3cdca0"
    if (status === "On the Way") return "#ffc850"
    if (status === "Preparing") return "#ff6464"
    return "var(--muted)"
}

const Admin = () => {
    const navi = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [error, setError] = useState("")
    const [filter, setFilter] = useState("All")
    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem("admin"))
        if (admin?.isAdmin) setIsLoggedIn(true)
    }, [])
    useEffect(() => {
        if (!isLoggedIn) return
        fetchOrders()
    }, [isLoggedIn])

    const fetchOrders = () => {
        setLoading(true)
        axios.get("http://localhost:5000/api/order/all")
            .then(res => {
                setOrders(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    const handleAdminLogin = async () => {
        if (!username || !password) { setError("Fill all fields"); return }
        try {
            const res = await axios.post("http://localhost:5000/api/users/admin-login", {
                username, password
            })
            localStorage.setItem("admin", JSON.stringify(res.data))
            setIsLoggedIn(true)
            setError("")
        } catch (err) {
            setError(err.response?.data?.message || "Login failed")
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await axios.patch(
                `http://localhost:5000/api/order/${orderId}/status`,
                { status: newStatus }
            )
            // Update locally without refetching
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
        } catch (err) {
            alert("Failed to update status")
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("admin")
        setIsLoggedIn(false)
    }

    const filteredOrders = filter === "All"
        ? orders
        : orders.filter(o => o.status === filter)
    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: "100dvh", display: "flex", alignItems: "center",
                justifyContent: "center", padding: 24, background: "var(--bg)"
            }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    style={{ width: "100%", maxWidth: 360 }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <span style={{ fontSize: 40 }}>Pizz<span style={{
                            color: "var(--orange)",
                        }}>A</span> Pala<span
                            style={{
                                color: "var(--orange)"
                            }}
                        >C</span><span
                            style={{
                                color: "var(--orange)",
                            }}
                        >e</span></span>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", marginTop: 8 }}>
                            Admin <span style={{ color: "var(--orange)" }}>Panel</span>
                        </h1>
                        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>PizzaPalace Dashboard</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <input
                            placeholder="Admin Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={{
                                padding: "12px 16px", borderRadius: 12,
                                border: "1px solid var(--border)",
                                background: "var(--bg3)", color: "var(--cream)",
                                fontSize: "0.9rem", outline: "none"
                            }}
                        />
                        <input
                            placeholder="Admin Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                            style={{
                                padding: "12px 16px", borderRadius: 12,
                                border: "1px solid var(--border)",
                                background: "var(--bg3)", color: "var(--cream)",
                                fontSize: "0.9rem", outline: "none"
                            }}
                        />
                        {error && <p style={{ color: "#ff6464", fontSize: "0.82rem" }}>{error}</p>}
                        <button
                            onClick={handleAdminLogin}
                            style={{
                                padding: "12px", borderRadius: 12,
                                background: "var(--orange)", color: "#fff",
                                border: "none", fontWeight: 700, fontSize: "1rem"
                            }}
                        >
                            Login to Dashboard →
                        </button>
                        <button className="bg-amber-600 text-white font-bold rounded-2xl p-2" onClick={() => navi('/')} style={{ width: "100%", marginTop: 4 }}>User in →</button>
                    </div>
                </motion.div>
            </div>
        )
    }
    return (
        <div style={{ padding: "24px 20px 60px", minHeight: "100dvh", background: "var(--bg)" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>
                        🍕 <span style={{ color: "var(--orange)" }}>PizzaPalace</span> Admin
                    </h1>
                    <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Manage all orders</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchOrders}
                        style={{ padding: "8px 16px", borderRadius: 10, background: "var(--bg3)", color: "var(--cream)", border: "1px solid var(--border)", fontSize: "0.85rem" }}>
                        🔄 Refresh
                    </button>
                    <button onClick={handleLogout}
                        style={{ padding: "8px 16px", borderRadius: 10, background: "#ff6464", color: "#fff", border: "none", fontSize: "0.85rem" }}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {["All", "Pending", "Preparing", "On the Way", "Delivered"].map(s => (
                    s === "All"
                        ? <div key={s} style={{ background: "var(--bg3)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                            <p style={{ fontSize: "1.4rem", fontWeight: 700 }}>{orders.length}</p>
                            <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Total Orders</p>
                        </div>
                        : <div key={s} style={{ background: "var(--bg3)", borderRadius: 12, padding: "14px 16px", textAlign: "center", borderTop: `3px solid ${getStatusColor(s)}` }}>
                            <p style={{ fontSize: "1.4rem", fontWeight: 700, color: getStatusColor(s) }}>
                                {orders.filter(o => o.status === s).length}
                            </p>
                            <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{s}</p>
                        </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {["All", "Pending", "Preparing", "On the Way", "Delivered"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        style={{
                            padding: "6px 16px", borderRadius: 20,
                            background: filter === f ? "var(--orange)" : "var(--bg3)",
                            color: filter === f ? "#fff" : "var(--muted)",
                            border: "1px solid var(--border)", fontSize: "0.82rem"
                        }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Orders */}
            {loading ? (
                <p style={{ color: "var(--muted)", textAlign: "center", marginTop: 60 }}>Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
                <p style={{ color: "var(--muted)", textAlign: "center", marginTop: 60 }}>No orders found</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {filteredOrders.map((order, i) => (
                        <motion.div key={order._id} className="card"
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{ padding: 16, borderLeft: `4px solid ${getStatusColor(order.status)}` }}>

                            {/* Order Info */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                <div>
                                    <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem" }}>
                                        #{order._id.slice(-6).toUpperCase()}
                                    </p>
                                    <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                                        User: {order.userId} • {new Date(order.createdAt).toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <p style={{ color: "var(--orange)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
                                    ₹{order.price}
                                </p>
                            </div>

                            {/* Address */}
                            {order.address && (
                                <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: "0.8rem", color: "var(--muted)" }}>
                                    📍 {order.address.name} • {order.address.phone} • {order.address.street}, {order.address.city} - {order.address.pincode}
                                </div>
                            )}

                            {/* Items */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                                {order.orderDetails.map((item, j) => (
                                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg3)", borderRadius: 8, padding: "4px 10px" }}>
                                        <img src={item.img} alt={item.name} style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }} />
                                        <span style={{ fontSize: "0.8rem" }}>{item.name} x{item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Status Updater */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Status:</span>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    {STATUS_OPTIONS.map(s => (
                                        <button key={s} onClick={() => handleStatusChange(order._id, s)}
                                            style={{
                                                padding: "4px 12px", borderRadius: 16, fontSize: "0.78rem",
                                                background: order.status === s ? getStatusColor(s) : "var(--bg3)",
                                                color: order.status === s ? "#fff" : "var(--muted)",
                                                border: `1px solid ${order.status === s ? getStatusColor(s) : "var(--border)"}`,
                                                fontWeight: order.status === s ? 700 : 400
                                            }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Admin