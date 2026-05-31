import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/navbar"

const coupons = [
  { code: "WELCOME20", desc: "20% off your first order", expiry: "30 Jun 2026", color: "#ff6464", valid: true },
  { code: "PIZZA50", desc: "Flat ₹50 off on pizzas", expiry: "15 Jun 2026", color: "#ffc850", valid: true },
  { code: "DRINK15", desc: "15% off all drinks", expiry: "01 Jun 2026", color: "#50b4ff", valid: true },
  { code: "GOLD10", desc: "Gold member exclusive 10%", expiry: "31 May 2026", color: "#f5c842", valid: false },
]

const Coupons = () => {
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
        <h1 className="section-title">My <span>Coupons</span></h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {coupons.map((c, i) => (
          <motion.div key={c.code} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
            style={{ borderRadius: 18, border: `1.5px dashed ${c.valid ? c.color : "var(--border)"}`, background: "var(--card)", padding: "16px 18px", opacity: c.valid ? 1 : 0.45 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: c.valid ? c.color : "var(--muted)", letterSpacing: "0.05em" }}>{c.code}</span>
              {c.valid
                ? <span style={{ fontSize: "0.7rem", background: `${c.color}18`, color: c.color, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>Active</span>
                : <span style={{ fontSize: "0.7rem", background: "rgba(255,255,255,0.05)", color: "var(--muted)", borderRadius: 6, padding: "2px 8px" }}>Expired</span>
              }
            </div>
            <p style={{ fontSize: "0.88rem", marginBottom: 6 }}>{c.desc}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Expires: {c.expiry}</p>
            {c.valid && (
              <button style={{ marginTop: 12, background: `${c.color}18`, border: `1px solid ${c.color}40`, borderRadius: 10, color: c.color, padding: "7px 18px", fontSize: "0.8rem", fontWeight: 600, cursor: "none" }}>
                Apply Coupon
              </button>
            )}
          </motion.div>
        ))}
      </div>
      <Navbar />
    </div>
  )
}

export default Coupons