import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/navbar"

const wishlist = [
  { name: "Truffle Mushroom", price: "₹379", img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&q=80" },
  { name: "Blue Lagoon", price: "₹159", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80" },
  { name: "Paneer Tikka", price: "₹319", img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80" },
]

const Wishlist = () => {
  const navi = useNavigate()
  return (
    <div className="page grain" style={{ padding: "24px 20px 130px" }}>
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
        <h1 className="section-title">My <span>Wishlist</span></h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {wishlist.map((w, i) => (
          <motion.div key={w.name} className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            style={{ display: "flex", gap: 14, padding: 14, alignItems: "center" }}>
            <img src={w.img} alt={w.name} style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", marginBottom: 4 }}>{w.name}</p>
              <p style={{ color: "var(--orange)", fontWeight: 700 }}>{w.price}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button className="add-btn" style={{ fontSize: "0.75rem", padding: "7px 12px" }}>+ Cart</button>
              <button style={{ background: "transparent", border: "1px solid rgba(230,57,70,0.3)", borderRadius: 8, color: "#e63946", fontSize: "0.72rem", padding: "5px 10px", cursor: "none" }}>Remove</button>
            </div>
          </motion.div>
        ))}
      </div>
      <Navbar />
    </div>
  )
}

export default Wishlist