import React from 'react'
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import Navbar from './components/navbar'
import Home from './components/Home'
import PizzaSection from './components/PizzaSectoion'
import Drinksection from './components/Drinksection'
import Account from './components/Account'
import Login from './Auth/login'
import Signup from './Auth/signup'
import Cursor from './additionalFx/Cursor'
import Help from './Account/Help'
import Order from './Account/Order'
import Wishlist from './Account/Wishlist'
import Coupons from './Account/Coupons'
import Member from './Account/Member'
import Cart from './components/Cart'        
import { CartProvider } from './context/CartContext'
import Admin from './Auth/Admin'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

const AnimatedPage = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
)

const noNavRoutes = ["/login", "/signup"]

const AppRoutes = () => {
  const location = useLocation()
  const hideNav = noNavRoutes.includes(location.pathname)

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/home" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/pizza" element={<AnimatedPage><PizzaSection /></AnimatedPage>} />
          <Route path="/drinks" element={<AnimatedPage><Drinksection /></AnimatedPage>} />
          <Route path="/account" element={<AnimatedPage><Account /></AnimatedPage>} />
          <Route path="/" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/signup" element={<AnimatedPage><Signup /></AnimatedPage>} />
          <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />   {/* ✅ Added */}
          <Route path="/order" element={<AnimatedPage><Order /></AnimatedPage>} />
          <Route path="/help" element={<AnimatedPage><Help /></AnimatedPage>} />
          <Route path="/wishlist" element={<AnimatedPage><Wishlist /></AnimatedPage>} />
          <Route path="/coupons" element={<AnimatedPage><Coupons /></AnimatedPage>} />
          <Route path="/admin" element={<AnimatedPage><Admin /></AnimatedPage>} />
          <Route path="/member" element={<AnimatedPage><Member /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
       <Cursor />
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App