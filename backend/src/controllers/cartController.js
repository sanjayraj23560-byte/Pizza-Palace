import Cart from "../models/Cart.js";

export const AddCart = async (req, res) => {
  try {
    const { userId, product } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: 1
        }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === product._id.toString()
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: 1
        });
      }
    }

    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server crashed while adding to cart" });
  }
};

export const ShowCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(200).json({ items: [] });

    res.status(200).json(cart);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Server crashed on fetch" });
  }
};

export const RemoveFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (index > -1) {
      if (cart.items[index].quantity > 1) {
        cart.items[index].quantity -= 1;
      } else {
        cart.items.splice(index, 1);
      }
    }

    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    console.error("Remove Error:", error);
    res.status(500).json({ message: "Server crashed while removing item" });
  }
};