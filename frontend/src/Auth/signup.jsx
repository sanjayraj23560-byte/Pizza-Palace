import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../config"
import axios from "axios"

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [Pass_span, set_pass_span] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async () => {
    if (username.trim() === "" || password.trim() === "") {
      alert("Please fill all fields")
      return;
    }

    axios.post(`${import.meta.env.VITE_API_URL}/api/users/signup`, {
        username: username,
        password: password,
      })
      .then((res) => {
        alert("Account created!")
        navigate("/")
        console.log(res)
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Signup failed")
        console.log(err)
      });
  };

  const handleGoogleSignup = async () => {
    try { await signInWithPopup(auth, googleProvider); navigate("/home") }
    catch (err) { alert("Google signup failed") }
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: 380 }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}></div>
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
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input className="input-field border-2 rounded-2xl p-5" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input className="input-field border-2 rounded-2xl p-5" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button className="bg-amber-600 text-white font-bold rounded-2xl p-2" onClick={handleSignup} style={{ width: "100%", marginTop: 4 }}>Register →</button>
          <button className="bg-amber-600 text-white font-bold rounded-2xl p-2" onClick={() => navigate('/admin')}>Go to admin</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <button className="btn-google border-2 p-3 rounded-2xl justify-center bg-amber-900" onClick={handleGoogleSignup}>
            <svg width="22" height="22" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.5 16.3 44 24 44z" /><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.9 6l6.2 5.2C40.3 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z" /></svg>
            <span className="rounded-2xl p-3 w-10 bg-amber-900">Continue with Google</span>
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--muted)", fontSize: "0.85rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--orange)", fontWeight: 600 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Signup