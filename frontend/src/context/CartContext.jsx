import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const getUser = () => JSON.parse(localStorage.getItem("user"))
  const getUserId = () => getUser()?._id

  useEffect(() => {
    const fetchCart = async () => {
      const userId = getUserId()
      if (!userId) return 
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${userId}`)
        if (res.data && res.data.items) {
          setCart(res.data.items);
        }
      } catch (error) {
        console.log("No existing cart found:", error);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    const userId = getUserId()
    if (!userId) return
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        userId: userId,
        product: product
      });
      setCart(response.data.items);
    } catch (error) {
      console.log("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    const userId = getUserId()
    if (!userId) return
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/remove`, {
        userId: userId,
        productId: productId
      });
      setCart(response.data.items);
    } catch (error) {
      console.log("Error removing from cart:", error);
    }
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};