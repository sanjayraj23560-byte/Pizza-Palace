import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
import Navbar from "../components/navbar"

const faqs = [
  { q: "How long does delivery take?", a: "Usually 25–40 minutes depending on your location and order size." },
  { q: "Can I cancel my order?", a: "You can cancel within 2 minutes of placing the order. After that it goes into preparation." },
  { q: "How do I apply a coupon?", a: "Go to Cart → enter your coupon code in the promo field before checkout." },
  { q: "What payment methods are accepted?", a: "UPI, credit/debit cards, net banking, and Cash on Delivery." },
  { q: "How do I upgrade my membership?", a: "Visit Account → Membership and choose your desired tier." },
]

const Help = () => {
  const navi = useNavigate()
  const [open, setOpen] = useState(null)

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
        <h1 className="section-title">Help &amp; <span>Support</span></h1>
      </div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 18, marginBottom: 24 }}>
        <p style={{ fontWeight: 600, marginBottom: 14 }}>Contact Us</p>
        <textarea className="input-field border-amber-800 border-2 rounded-2xl p-2 " rows={3} placeholder="Describe your issue ...!! " style={{ marginBottom: 12, resize: "none"  , width:50%""}} />
        <button className="btn-primary bg-amber-800 rounded-2xl p-2" style={{ width: "100%" }}>Send Message</button>
      </motion.div>

      {/* FAQs */}
      <p style={{ fontWeight: 600, marginBottom: 14, color: "var(--muted)", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>FAQs</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {faqs.map((f, i) => (
          <motion.div key={i} className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
            style={{ padding: "14px 16px", cursor: "none" }} onClick={() => setOpen(open === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>{f.q}</p>
              <i className={`ti ti-chevron-${open === i ? "up" : "down"}`} style={{ color: "var(--muted)", flexShrink: 0 }} />
            </div>
            {open === i && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                style={{ marginTop: 10, color: "var(--muted)", fontSize: "0.84rem", lineHeight: 1.5 }}>
                {f.a}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
      <Navbar />
    </div>
  )
}

export default Help