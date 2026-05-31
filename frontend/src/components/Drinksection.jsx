import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "./navbar"
import { useEffect, useState, useContext } from "react"
import { CartContext } from "../context/CartContext"
import axios from "axios"

const Drinksection = () => {
    const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
    const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
    const [drink, SetDrink] = useState([])
    const { addToCart } = useContext(CartContext)
    const [toast, setToast] = useState(false)
    const navi = useNavigate()

    useEffect(() => {
        const FetchDrinks = async () => {
            axios.get("http://localhost:5000/api/drink")
                .then((res) => { SetDrink(res.data) })
                .catch((err) => { console.log(err) })
        }
        FetchDrinks();
    }, [])

    useEffect(() => {
        const handleKey = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
            if (e.key === "p" || e.key === "P") navi('/pizza')  
            if (e.key === "h" || e.key === "H") navi('/home')  
            if (e.key === "c" || e.key === "C") navi('/cart') 
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [])

    const handleAdd = (d) => {
        addToCart(d)
        setToast(true)
        setTimeout(() => setToast(false), 2000)
    }

    return (
        <div style={{ minHeight: "100dvh", background: "var(--bg)", padding: "24px 24px 140px" }}>
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
                <button className="back-btn" onClick={() => navi('/home')}>← Back</button>
                <div>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--cream)" }}>
                        Cool <span style={{ color: "var(--orange)" }}>Drink</span>
                    </h1>
                    <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{drink.length} refreshing options</p>
                </div>

                {/* ✅ Shortcut hint */}
                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    <span style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", color: "var(--muted)" }}>P pizza</span>
                    <span style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", color: "var(--muted)" }}>C cart</span>
                </div>
            </div>

            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-green-700 rounded-2xl p-3 flex w-50 right-10 z-30 border-green-800 border-2 fixed"
                >
                    <p>Added to cart! 🛒</p>
                </motion.div>
            )}
            <motion.div
                variants={stagger} initial="initial" animate="animate"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}
            >
                {drink.map(d => (
                    <motion.div key={d.name} variants={fadeUp}
                        whileHover={{ y: -5, boxShadow: "0 16px 32px rgba(0,0,0,0.45)" }}
                        style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}
                    >
                        <img src={d.img} alt={d.name} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
                        <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
                            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--cream)", marginBottom: 4, lineHeight: 1.3 }}>{d.name}</h3>
                            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 12, flex: 1, lineHeight: 1.5 }}>{d.desc}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "var(--orange)", fontWeight: 700, fontSize: "0.95rem" }}>{d.price}</span>
                                <button
                                    style={{ background: "var(--orange)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: "0.78rem", fontWeight: 600 }}
                                    onClick={() => handleAdd(d)}
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

export default Drinksection