import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useContext } from "react"
import Navbar from "./navbar"
import { CartContext } from "../context/CartContext"
import axios from "axios"

const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

const PizzaSection = () => {

  const [cart, Setcart] = useState([])
  const navi = useNavigate()
  const [pizzas, setPizzas] = useState([])
  const [btn, setbtn] = useState(true)
  const { addToCart } = useContext(CartContext)
  const [toast, setToast] = useState(false)
  useEffect(() => {
    const Fetch_pizza = async () => {
      axios.get(`${import.meta.env.VITE_API_URL}/api/pizza`)
        .then((res) => { setPizzas(res.data) })
        .catch((err) => { console.log("Error fetching the menu:", err) })
    };
    Fetch_pizza()
  }, []);
  const handleAdd = (p) => {
    addToCart(p)
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", padding: "24px 24px 140px" }}>
      <motion.span
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.45,
          ease: "easeOut",
        }}
        className="text-4xl font-bold text-white"
      >
        Pizz
        <span style={{ color: "var(--orange)" }}>A</span> Pala
        <span style={{ color: "var(--orange)" }}>C</span>
        <span style={{ color: "var(--orange)" }}>e</span>
      </motion.span>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button className="back-btn" onClick={() => navi('/home')}>← Back</button>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--cream)" }}>
            Our <span style={{ color: "var(--orange)" }}>Pizzas</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{pizzas.length} varieties available</p>
        </div>
      </div>
      {toast && (
        <div className="bg-green-700 rounded-2xl p-3 flex w-50 right-10 z-30 border-green-800 border-2 fixed">
          <p>Added to cart!</p>
        </div>
      )}

      <motion.div
        variants={stagger} initial="initial" animate="animate"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}>

        {pizzas.map((p, index) => (
          <motion.div key={p.name} variants={fadeUp}
            whileHover={{ y: -5, boxShadow: "0 16px 32px rgba(0,0,0,0.45)" }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>

            <img src={p.img} alt={p.name}
              style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--cream)", marginBottom: 4, lineHeight: 1.3 }}>
                {p.name}
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 12, flex: 1, lineHeight: 1.5 }}>
                {p.desc}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--orange)", fontWeight: 700, fontSize: "0.95rem" }}>₹{p.price}</span>
                <button
                  style={{ background: "var(--orange)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: "0.78rem", fontWeight: 600 }}
                  onClick={() => handleAdd(p)}
                >+ Add</button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <Navbar />
    </div>
  )
}
export default PizzaSection