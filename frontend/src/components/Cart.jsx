import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "./navbar"
import { CartContext } from "../context/CartContext"
import axios from "axios"

const Cart = () => {
  const navi = useNavigate()
  const { cart, addToCart, removeFromCart, getCartTotal, clearCart } = useContext(CartContext)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: ""
  })
  const [placing, setPlacing] = useState(false)
  const [step, setStep] = useState("address")

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const isAddressValid = () => {
    return address.name && address.phone && address.street && address.city && address.pincode
  }

  const handleAddressConfirm = () => {
    if (!isAddressValid()) return
    setStep("payment")
  }

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user?._id

    if (!userId) {
      alert("Please login first!")
      return
    }

    setPlacing(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/membership/create-order`, {
        amount: getCartTotal(),
        membership: "order"
      })

      const order = res.data
      if (!order || !order.amount) {
        alert("Payment initialization failed! Please try again.")
        setPlacing(false)
        return
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "PizzaPalace",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/order`, {
              cart: cart,
              total: getCartTotal(),
              userId: userId,
              address: address,
              paymentId: response.razorpay_payment_id
            })
            clearCart()
            setShowAddressModal(false)
            setStep("address")
            navi('/order')
          } catch (err) {
            console.error("Order Error:", err.message)
            alert("Payment done but order failed! Contact support.")
            setPlacing(false)
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: { color: "#8f421f" },
        modal: {
          ondismiss: () => setPlacing(false)
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      console.error("Payment init error:", err)
      alert(`Payment failed: ${err.response?.data?.message || err.message}`)
      setPlacing(false)
    }
  }
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--bg3)",
    color: "var(--cream)",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box"
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
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button className="back-btn" onClick={() => navi('/home')}>← Back</button>
        <h1 className="section-title">Your <span>Cart</span></h1>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 60, color: "var(--muted)" }}>
          <i className="ti ti-shopping-cart" style={{ fontSize: 48, display: "block", marginBottom: 12 }} />
          <br />
          <h1><span className="text-amber-600">Login before adding to cart</span></h1>
          <br />
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {cart.map((item, i) => (
              <motion.div key={item.productId} className="card"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ display: "flex", gap: 14, padding: 14, alignItems: "center" }}>
                <img src={item.img} alt={item.name}
                  style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", marginBottom: 4 }}>{item.name}</p>
                  <p style={{ color: "var(--orange)", fontWeight: 700 }}>₹{item.price}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => removeFromCart(item.productId)}
                    style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--cream)", width: 28, height: 28, cursor: "pointer" }}>−</button>
                  <span style={{ fontSize: "0.9rem", minWidth: 16, textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}
                    style={{ background: "var(--orange)", border: "none", borderRadius: 8, color: "#fff", width: 28, height: 28, cursor: "pointer" }}>+</button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>Subtotal</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>Delivery</span>
              <span style={{ color: "#3cdca0" }}>Free</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--orange)" }}>
                ₹{getCartTotal()}
              </span>
            </div>
            <button className="btn-primary"
              style={{ width: "100%", textAlign: "center", cursor: "pointer" }}
              onClick={() => { setStep("address"); setShowAddressModal(true) }}>
              Proceed to Checkout →
            </button>
          </motion.div>
        </>
      )}

      <AnimatePresence>
        {showAddressModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowAddressModal(false); setStep("address"); setPlacing(false) }}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.75)",
                zIndex: 9998, backdropFilter: "blur(4px)"
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "var(--bg2)",
                borderRadius: "24px 24px 0 0",
                zIndex: 9999, height: "75vh",
                display: "flex", flexDirection: "column",
              }}
            >
              {/* Drag handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 20px 12px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: step === "address" ? "var(--orange)" : "#3cdca0",
                  borderRadius: 20, padding: "4px 12px"
                }}>
                  <i className={`ti ${step === "address" ? "ti-map-pin" : "ti-check"}`}
                    style={{ fontSize: 13, color: "#fff" }} />
                  <span style={{ fontSize: "0.78rem", color: "#fff", fontWeight: 600 }}>Address</span>
                </div>
                <div style={{ flex: 1, height: 1, background: step === "payment" ? "var(--orange)" : "var(--border)" }} />
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: step === "payment" ? "var(--orange)" : "var(--bg3)",
                  borderRadius: 20, padding: "4px 12px",
                  border: "1px solid var(--border)"
                }}>
                  <i className="ti ti-credit-card" style={{ fontSize: 13, color: step === "payment" ? "#fff" : "var(--muted)" }} />
                  <span style={{ fontSize: "0.78rem", color: step === "payment" ? "#fff" : "var(--muted)", fontWeight: 600 }}>Payment</span>
                </div>
              </div>

              {step === "address" && (
                <>

                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 8px" }}>
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
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: 6 }}>
                      Delivery <span style={{ color: "var(--orange)" }}>Address</span>
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 20 }}>
                      Where should we deliver your order?
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <input name="name" placeholder="Full Name"
                        value={address.name} onChange={handleAddressChange} style={inputStyle} />
                      <input name="phone" placeholder="Phone Number" type="tel"
                        value={address.phone} onChange={handleAddressChange} style={inputStyle} />
                      <input name="street" placeholder="Street / Flat / Area"
                        value={address.street} onChange={handleAddressChange} style={inputStyle} />
                      <div style={{ display: "flex", gap: 10 }}>
                        <input name="city" placeholder="City"
                          value={address.city} onChange={handleAddressChange}
                          style={{ ...inputStyle, flex: 1 }} />
                        <input name="pincode" placeholder="Pincode" type="number"
                          value={address.pincode} onChange={handleAddressChange}
                          style={{ ...inputStyle, flex: 1 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px 32px", borderTop: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 }}>
                    <button
                      className="btn-primary"
                      onClick={handleAddressConfirm}
                      disabled={!isAddressValid()}
                      style={{
                        width: "100%", cursor: isAddressValid() ? "pointer" : "not-allowed",
                        opacity: isAddressValid() ? 1 : 0.5, textAlign: "center"
                      }}
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </>
              )}

              {step === "payment" && (
                <>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px" }}>
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
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: 16 }}>
                      Order <span style={{ color: "var(--orange)" }}>Summary</span>
                    </h2>

                    {/* Address summary */}
                    <div style={{ background: "var(--bg3)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Delivering to</span>
                        <button onClick={() => setStep("address")}
                          style={{ background: "none", border: "none", color: "var(--orange)", fontSize: "0.78rem", fontWeight: 600 }}>
                          Edit
                        </button>
                      </div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>{address.name} • {address.phone}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
                        {address.street}, {address.city} - {address.pincode}
                      </p>
                    </div>

                    {/* Items summary */}
                    <div style={{ background: "var(--bg3)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                      {cart.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: "0.84rem" }}>{item.name} x{item.quantity}</span>
                          <span style={{ fontSize: "0.84rem", color: "var(--orange)" }}>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 700 }}>Total</span>
                        <span style={{ fontWeight: 700, color: "var(--orange)" }}>₹{getCartTotal()}</span>
                      </div>
                    </div>

                    {/* Payment methods info */}
                    <div style={{ background: "var(--bg3)", borderRadius: 12, padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 8 }}>Accepted payments</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["UPI", "Cards", "Net Banking", "Wallets"].map(m => (
                          <span key={m} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", fontSize: "0.75rem", color: "var(--cream)" }}>
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "16px 20px 32px", borderTop: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 }}>
                    <button
                      className="border-2 p-3 rounded-2xl justify-center flex items-center gap-2 bg-amber-800 text-white font-semibold"
                      onClick={handlePayment}
                      disabled={placing}
                      style={{
                        width: "100%", cursor: "pointer",
                        opacity: placing ? 0.7 : 1, textAlign: "center",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                      }}
                    >
                      <i className="ti ti-lock" style={{ fontSize: 16 }} />
                      {placing ? "Opening Payment..." : `Pay ₹${getCartTotal()} with Razorpay`}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Navbar />
    </div>
  )
}

export default Cart