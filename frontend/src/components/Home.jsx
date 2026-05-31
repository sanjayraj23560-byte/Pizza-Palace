import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./navbar"
import { motion, AnimatePresence } from "framer-motion"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import axios from "axios"

const stagger = { animate: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const Home = () => {
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(false)
  const [search, setSearch] = useState("")

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // ✅ Fetch both pizzas and drinks
        const [pizzaRes, drinkRes] = await Promise.all([
          axios.get("http://localhost:5000/api/pizza"),
          axios.get("http://localhost:5000/api/drink")
        ])

        const pizzas = pizzaRes.data.slice(0, 3).map(p => ({ ...p, type: "pizza" }))
        const drinks = drinkRes.data.slice(0, 2).map(d => ({ ...d, type: "drink" }))

        // ✅ Mix pizzas and drinks, take first 5
        setFeatured([...pizzas, ...drinks])
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch featured:", err)
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const handleAdd = (item) => {
    addToCart(item)
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  // ✅ Filter by search
  const filtered = featured.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page grain" style={{ padding: "24px 20px 130px" }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed", top: 20, right: 20, zIndex: 9999,
              background: "#3cdca0", borderRadius: 12, padding: "10px 18px",
              display: "flex", alignItems: "center", gap: 8
            }}>
            <i className="ti ti-shopping-cart" style={{ color: "#0d2a1e" }} />
            <span style={{ color: "#0d2a1e", fontWeight: 600, fontSize: "0.85rem" }}>Added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ marginBottom: 8 }}>
        <span className="text-4xl font-bold text-white">
          Pizz<span style={{ color: "var(--orange)" }}>A</span> Pala
          <span style={{ color: "var(--orange)" }}>C</span>
          <span style={{ color: "var(--orange)" }}>e</span>
        </span>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 6 }}>
          Welcome back, <span style={{ color: "var(--cream)", fontWeight: 600 }}>{user?.username || "Guest"}</span> 👋
        </p>
      </motion.div>

      <motion.div variants={stagger} initial="initial" animate="animate">

        {/* Search bar */}
        <motion.div variants={fadeUp} style={{ position: "relative", marginBottom: 28, marginTop: 16 }}>
          <i className="ti ti-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            className="input-field border-2 rounded-2xl p-2 border-amber-800"
            placeholder="Search pizzas, drinks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 40, width: "100%" }}
          />
        </motion.div>

        {/* Quick nav buttons */}
        <motion.div variants={fadeUp} style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <button onClick={() => navigate('/pizza')}
            style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 0", color: "var(--cream)", fontWeight: 600, fontSize: "0.85rem" }}>
            🍕 Pizzas
          </button>
          <button onClick={() => navigate('/drinks')}
            style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 0", color: "var(--cream)", fontWeight: 600, fontSize: "0.85rem" }}>
            🥤 Drinks
          </button>
          <button onClick={() => navigate('/cart')}
            style={{ flex: 1, background: "var(--orange)", border: "none", borderRadius: 14, padding: "12px 0", color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>
            🛒 Cart
          </button>
        </motion.div>

        {/* Featured */}
        <motion.div variants={fadeUp}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 16 }}>
            Featured <span style={{ color: "var(--orange)" }}>Today</span>
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
              Loading menu...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
              No items found for "{search}"
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filtered.map((f, i) => (
                <motion.div key={f._id || f.name} className="card"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 4 }}
                  style={{ display: "flex", gap: 14, padding: 12, alignItems: "center" }}>
                  <img src={f.img} alt={f.name}
                    style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    {/* ✅ Type badge */}
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: f.type === "pizza" ? "var(--orange)" : "#50b4ff"
                    }}>
                      {f.type === "pizza" ? "🍕 Pizza" : "🥤 Drink"}
                    </span>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", margin: "2px 0 4px" }}>
                      {f.name}
                    </p>
                    <p style={{ color: "var(--orange)", fontWeight: 700 }}>
                      ₹{f.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd(f)}
                    className="btn-primary"
                    style={{ padding: "8px 14px", fontSize: "0.8rem", borderRadius: 10, flexShrink: 0 }}>
                    + Add
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
      <Navbar />
    </div>
  )
}

export default Home