import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../components/navbar"
import { useState } from "react"
import axios from "axios"

const tiers = [
  {
    id: 1,
    name: "Diamond",
    icon: "ti-diamond",
    price: "₹999/mo",
    amount: 999,
    color1: "#a8edea",
    color2: "#4fc3f7",
    textColor: "#0d1b2a",
    perks: ["Free delivery on all orders", "20% off every order", "Priority support 24/7", "Exclusive Diamond menu items", "Early access to new launches"],
    badge: "💎",
  },
  {
    id: 2,
    name: "Gold",
    icon: "ti-crown",
    price: "₹599/mo",
    amount: 599,
    color1: "#f5c842",
    color2: "#e08c00",
    textColor: "#1a1000",
    perks: ["Free delivery on orders ₹200+", "15% off every order", "Gold-only deals weekly", "Priority queue at checkout"],
    badge: "🏆",
  },
  {
    id: 3,
    name: "Platinum",
    icon: "ti-medal",
    price: "₹399/mo",
    amount: 399,
    color1: "#d0d0d0",
    color2: "#888",
    textColor: "#111",
    perks: ["Free delivery on orders ₹300+", "10% off every order", "Monthly surprise coupon", "Platinum badge on profile"],
    badge: "🥈",
  },
  {
    id: 4,
    name: "Ruby",
    icon: "ti-heart",
    price: "₹199/mo",
    amount: 199,
    color1: "#ff6b8a",
    color2: "#c0003c",
    textColor: "#1a0010",
    perks: ["Free delivery on orders ₹400+", "5% off every order", "Ruby welcome gift", "Birthday special discount"],
    badge: "❤️",
  },
]

const Member = () => {
  const navi = useNavigate()
  const [selectedTier, setSelectedTier] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)

  // ✅ Track current membership in state so UI updates instantly
  const [currentMembership, setCurrentMembership] = useState(
    JSON.parse(localStorage.getItem("user"))?.membership || "none"
  )

  const user = JSON.parse(localStorage.getItem("user"))

  const handleSubscribe = (tier) => {
    if (!user) {
      alert("Please login first!")
      navi('/')
      return
    }
    // ✅ Don't allow subscribing to already active tier
    if (currentMembership === tier.name) return
    setSelectedTier(tier)
    setShowModal(true)
  }

  const handlePayment = async () => {
    if (!selectedTier) return
    setPaying(true)

    try {
      const { data: order } = await axios.post("http://localhost:5000/api/membership/create-order", {
        amount: selectedTier.amount,
        membership: selectedTier.name
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "PizzaPalace",
        description: `${selectedTier.name} Membership`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post("http://localhost:5000/api/membership/verify", {
              ...response,
              userId: user._id,
              membership: selectedTier.name
            })

            // ✅ Update localStorage
            const updatedUser = { ...user, membership: selectedTier.name }
            localStorage.setItem("user", JSON.stringify(updatedUser))

            // ✅ Update state so UI reflects instantly
            setCurrentMembership(selectedTier.name)
            setShowModal(false)
            setSuccess(true)
            setPaying(false)

          } catch {
            alert("Payment verification failed!")
            setPaying(false)
          }
        },
        prefill: { name: user.username },
        theme: { color: "#8f421f" },
        modal: { ondismiss: () => setPaying(false) }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      console.error(err)
      alert("Payment failed to initialize")
      setPaying(false)
    }
  }

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
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button className="back-btn" onClick={() => navi('/account')}>← Back</button>
        <div>
          <h1 className="section-title">Member<span>ship</span></h1>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
            {currentMembership !== "none"
              ? `Active: ${currentMembership}`
              : "Choose your tier"}
          </p>
        </div>
      </div>

      {/* ✅ Success Banner */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              background: "#3cdca0", borderRadius: 14, padding: "16px 20px",
              marginBottom: 20, display: "flex", alignItems: "center", gap: 12
            }}>
            <span style={{ fontSize: 24 }}>🎉</span>
            <div>
              <p style={{ color: "#0d2a1e", fontWeight: 700 }}>
                Welcome to {selectedTier?.name} membership!
              </p>
              <p style={{ color: "#0d2a1e", fontSize: "0.82rem", opacity: 0.8 }}>
                Your perks are now active
              </p>
            </div>
            <button onClick={() => setSuccess(false)}
              style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 18, color: "#0d2a1e" }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Membership Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20 }}>
        {tiers.map((t, i) => {
          const isActive = currentMembership === t.name

          return (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ scale: isActive ? 1 : 1.02, transition: { duration: 0.25 } }}
              style={{
                borderRadius: 22,
                background: `linear-gradient(135deg, ${t.color1}, ${t.color2})`,
                padding: "22px 22px 20px",
                position: "relative", overflow: "hidden",
                boxShadow: isActive
                  ? `0 0 0 3px #fff, 0 8px 32px rgba(0,0,0,0.5)`  // ✅ glowing border for active
                  : `0 8px 32px rgba(0,0,0,0.4)`,
              }}>

              {/* ✅ Active ribbon */}
              {isActive && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(0,0,0,0.25)", borderRadius: 20,
                  padding: "4px 12px", display: "flex", alignItems: "center", gap: 4
                }}>
                  <i className="ti ti-circle-check" style={{ color: t.textColor, fontSize: 13 }} />
                  <span style={{ color: t.textColor, fontSize: "0.75rem", fontWeight: 700 }}>Active</span>
                </div>
              )}

              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
              <div style={{ position: "absolute", top: 20, right: -10, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <i className={`ti ${t.icon}`} style={{ fontSize: 22, color: t.textColor }} />
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: t.textColor, fontWeight: 900 }}>
                        {t.name}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: t.textColor, opacity: 0.7, fontWeight: 500 }}>
                      Pizza Palace Membership
                    </span>
                  </div>
                  <span style={{ fontSize: 32, marginTop: isActive ? 20 : 0 }}>{t.badge}</span>
                </div>

                <div style={{ borderTop: `1px solid rgba(0,0,0,0.12)`, margin: "12px 0" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
                  {t.perks.map(perk => (
                    <div key={perk} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className="ti ti-check" style={{ fontSize: 11, color: t.textColor }} />
                      </div>
                      <span style={{ fontSize: "0.82rem", color: t.textColor, opacity: 0.85 }}>{perk}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: t.textColor, opacity: 0.6 }}>Starting at</p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 900, color: t.textColor }}>
                      {t.price}
                    </p>
                  </div>

                  {/* ✅ Active vs Subscribe button */}
                  {isActive ? (
                    <div style={{
                      background: "rgba(0,0,0,0.18)", border: "2px solid rgba(0,0,0,0.25)",
                      borderRadius: 12, padding: "10px 20px",
                      display: "flex", alignItems: "center", gap: 6
                    }}>
                      <i className="ti ti-circle-check" style={{ color: t.textColor, fontSize: 16 }} />
                      <span style={{ color: t.textColor, fontWeight: 700, fontSize: "0.85rem" }}>Subscribed</span>
                    </div>
                  ) : (
                    <button onClick={() => handleSubscribe(t)}
                      style={{
                        background: "rgba(0,0,0,0.18)", border: "1.5px solid rgba(0,0,0,0.2)",
                        borderRadius: 12, padding: "10px 20px",
                        color: t.textColor, fontWeight: 700, fontSize: "0.85rem",
                        backdropFilter: "blur(4px)",
                      }}>
                      Subscribe →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {showModal && selectedTier && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowModal(false); setPaying(false) }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9998, backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "var(--bg2)", borderRadius: "24px 24px 0 0",
                zIndex: 9999, padding: "28px 24px 40px"
              }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)" }} />
              </div>

              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 48 }}>{selectedTier.badge}</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", margin: "8px 0 4px" }}>
                  {selectedTier.name} <span style={{ color: "var(--orange)" }}>Membership</span>
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  You'll be charged {selectedTier.price}
                </p>
              </div>

              <div style={{ background: "var(--bg3)", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
                {selectedTier.perks.map(p => (
                  <div key={p} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <i className="ti ti-check" style={{ color: "#3cdca0", fontSize: 14 }} />
                    <span style={{ fontSize: "0.82rem", color: "var(--cream)" }}>{p}</span>
                  </div>
                ))}
              </div>

              <button onClick={handlePayment} disabled={paying}
                style={{
                  width: "100%", padding: "14px", borderRadius: 14,
                  background: paying ? "var(--bg3)" : "var(--orange)",
                  color: "#fff", border: "none", fontWeight: 700,
                  fontSize: "1rem", opacity: paying ? 0.7 : 1
                }}>
                {paying ? "Opening Payment..." : `Pay ${selectedTier.price} with Razorpay`}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Navbar />
    </div>
  )
}

export default Member