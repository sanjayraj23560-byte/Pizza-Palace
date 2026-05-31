import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "./navbar"

const menuItems = [
  { label: "My Orders", icon: "ti-receipt", path: "/order", color: "#ff6464", desc: "Track & reorder" },
  { label: "Wishlist", icon: "ti-heart", path: "/wishlist", color: "#ff6b8a", desc: "Saved favourites" },
  { label: "Coupons", icon: "ti-ticket", path: "/coupons", color: "#ffc850", desc: "Deals & offers" },
  { label: "Membership", icon: "ti-crown", path: "/member", color: "#f5c842", desc: "Your tier & perks" },
  { label: "Help", icon: "ti-help-circle", path: "/help", color: "#50b4ff", desc: "Support & FAQs" },
]

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

// ✅ membership badge config
const membershipConfig = {
  Diamond: { icon: "💎", color: "#4fc3f7", bg: "rgba(79,195,247,0.15)" },
  Gold: { icon: "🏆", color: "#f5c842", bg: "rgba(245,200,66,0.15)" },
  Platinum: { icon: "🥈", color: "#d0d0d0", bg: "rgba(208,208,208,0.15)" },
  Ruby: { icon: "❤️", color: "#ff6b8a", bg: "rgba(255,107,138,0.15)" },
  none: { icon: "👤", color: "var(--muted)", bg: "rgba(255,255,255,0.05)" },
}

const Account = () => {
  const navi = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  // ✅ Read real membership from localStorage
  const membership = user?.membership || "none"
  const memberBadge = membershipConfig[membership] || membershipConfig["none"]

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
        <button className="back-btn" onClick={() => navi('/home')}>← Back</button>
        <h1 className="section-title">My <span>Account</span></h1>
      </div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card"
        style={{ padding: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,var(--orange),#e63946)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
          👤
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem" }}>
            {user?.username || "Guest"}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
            {user?.email || "No email"}
          </p>
          {/* ✅ Dynamic membership badge */}
          {membership === "none" ? (
            <span
              onClick={() => navi('/member')}
              style={{ fontSize: "0.72rem", background: "rgba(255,255,255,0.06)", color: "var(--muted)", borderRadius: 6, padding: "2px 8px", marginTop: 4, display: "inline-block", fontWeight: 600, cursor: "pointer" }}>
              No membership — Upgrade →
            </span>
          ) : (
            <span style={{ fontSize: "0.72rem", background: memberBadge.bg, color: memberBadge.color, borderRadius: 6, padding: "2px 8px", marginTop: 4, display: "inline-block", fontWeight: 600 }}>
              {memberBadge.icon} {membership} Member
            </span>
          )}
        </div>
      </motion.div>

      {/* Menu */}
      <motion.div variants={stagger} initial="initial" animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {menuItems.map(m => (
          <motion.div key={m.path} variants={fadeUp} className="card"
            onClick={() => navi(m.path)}
            style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "none" }}
            whileHover={{ x: 6, transition: { duration: 0.2 } }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={`ti ${m.icon}`} style={{ fontSize: 20, color: m.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{m.label}</p>
              <p style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{m.desc}</p>
            </div>
            <i className="ti ti-chevron-right" style={{ color: "var(--muted)", fontSize: 18 }} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ marginTop: 20 }}>
        <button
          onClick={() => {
            localStorage.removeItem("user")
            localStorage.removeItem("admin")
            navi('/')
          }}
          style={{ width: "100%", background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: 14, padding: 13, color: "#e63946", fontWeight: 600, cursor: "none", transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(230,57,70,0.18)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(230,57,70,0.1)"}>
          <i className="ti ti-logout" style={{ marginRight: 8 }} />Log Out
        </button>
      </motion.div>
      <Navbar />
    </div>
  )
}

export default Account