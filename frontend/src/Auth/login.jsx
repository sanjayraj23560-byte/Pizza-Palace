import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config";
import axios from "axios";
import pizzaLogo from "../Assets/effect_logo.png";

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [effect, setEffect] = useState(true);

  const Auth = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }
    axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res) {
          console.log(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          navigate("/home");
        }
      })
      .catch((err) => {
        alert("Please signUp");
        if (err) {
          navigate("/signup");
          console.log(err);
        }
      });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: result.user.uid,
          username: result.user.displayName,
          email: result.user.email,
        })
      );
      navigate("/home");
    } catch (err) {
      alert(err.code);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setEffect(false);
    }, 3000);
  }, []);

  return (
    <div style={{ overflow: "hidden", position: "relative", width: "100vw", minHeight: "100dvh" }}>
      <AnimatePresence mode="wait">
        {effect ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="min-h-screen flex flex-col items-center justify-center text-center px-6"
            style={{ background: "var(--bg67)", position: "absolute", width: "100%", zIndex: 10 }}
          >
            <motion.img
              src={pizzaLogo}
              alt="Pizza Palace Logo"
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="w-42 h-42 object-contain mb-4"
            />

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

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.7,
                ease: "easeOut",
              }}
              className="mt-3 text-sm text-gray-400"
            >
              All rights reserved since © 1947
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              minHeight: "100dvh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              background: "var(--bg)",
            }}
          >
            <motion.div
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
              style={{ width: "100%", maxWidth: 380 }}
            >
              <motion.div variants={itemVariants} style={{ textAlign: "center", marginBottom: 36 }}>
                <span style={{ fontSize: 40 }}>
                  Pizz<span style={{ color: "var(--orange)" }}>A</span> Pala
                  <span style={{ color: "var(--orange)" }}>C</span>
                  <span style={{ color: "var(--orange)" }}>e</span>
                </span>
              </motion.div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <motion.input
                  variants={itemVariants}
                  whileFocus={{ scale: 1.02 }}
                  className="input-field border-2 rounded-2xl p-5"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  type="text"
                  style={{ outline: "none" }}
                />
                
                <motion.input
                  variants={itemVariants}
                  whileFocus={{ scale: 1.02 }}
                  className="input-field border-2 rounded-2xl p-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  style={{ outline: "none" }}
                />
                
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-amber-600 text-white font-bold rounded-2xl p-2"
                  onClick={Auth}
                  style={{ width: "100%", marginTop: 4 }}
                >
                  Login →
                </motion.button>

                <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                </motion.div>
                
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-google border-2 p-3 rounded-2xl justify-center flex items-center gap-2 bg-amber-900 text-white font-semibold"
                  onClick={handleGoogleLogin}
                >
                  <svg width="22" height="22" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.5 16.3 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.9 6l6.2 5.2C40.3 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z" />
                  </svg>
                  <span>Continue with Google</span>
                </motion.button>
              </div>

              <motion.p variants={itemVariants} style={{ textAlign: "center", marginTop: 24, color: "var(--muted)", fontSize: "0.85rem" }}>
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "var(--orange)", fontWeight: 600 }}>
                  Sign Up
                </Link>
              </motion.p>
              
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-800 text-white font-bold rounded-2xl p-2"
                onClick={() => navigate("/admin")}
                style={{ width: "100%", marginTop: 16 }}
              >
                Admin Signin
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
);
};

export default Login;