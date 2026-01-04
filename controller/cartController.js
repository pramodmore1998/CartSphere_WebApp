import userModel from "../models/userModel.js";

// Add to Cart
// Add to Cart with quantity
export const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await userModel.findById(req.decodeUser._id);

    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    const populatedUser = await userModel
      .findById(user._id)
      .populate("cart.product");

    res.json({ success: true, cart: populatedUser.cart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, msg: "Error adding to cart" });
  }
};



// Get Cart
export const getCartController = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.decodeUser._id)
      .populate("cart.product");

    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    res.json({
      success: true,
      cart: user.cart,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, msg: "Error loading cart" });
  }
};

// Remove from Cart
export const removeFromCartController = async (req, res) => {
  try {
    const user = await userModel.findById(req.decodeUser._id);

    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    user.cart = user.cart.filter(
      item => item.product.toString() !== req.params.pid
    );

    await user.save();

    const populatedUser = await userModel
      .findById(user._id)
      .populate("cart.product");

    res.json({ success: true, cart: populatedUser.cart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, msg: "Error removing from cart" });
  }
};


// Update quantity (+ / -)
export const updateCartQuantityController = async (req, res) => {
  try {
    const { productId, action } = req.body; // action = "inc" | "dec"

    const user = await userModel.findById(req.decodeUser._id);
    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).send({ success: false, msg: "Item not in cart" });
    }

    if (action === "inc") {
      user.cart[itemIndex].quantity += 1;
    }

    if (action === "dec") {
      if (user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      } else {
        // quantity = 1 → remove item
        user.cart.splice(itemIndex, 1);
      }
    }

    await user.save();

    const populatedUser = await userModel
      .findById(req.decodeUser._id)
      .populate("cart.product");

    res.json({ success: true, cart: populatedUser.cart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, msg: "Quantity update failed" });
  }
};
