import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearAllCart,
  clearProduct,
  getCart,
  updateCart
} from "./cart";

interface Products {
  product_id: string;
  quantity: number;
  price: number;
}

interface CartData {
  _id?: string;
  id?: string;
  user_id: string;
  temp_order_id: null;
  products: Products[];
  total_price: number;
}

interface CartState {
  addToCartStatus: "idle" | "isLoading" | "succeeded" | "failed";
  updateCartStatus: "idle" | "isLoading" | "succeeded" | "failed";
  getCartStatus: "idle" | "isLoading" | "succeeded" | "failed";
  clearAllCartStatus: "idle" | "isLoading" | "succeeded" | "failed";
  clearProductStatus: "idle" | "isLoading" | "succeeded" | "failed";
  cart: CartData | null;
  allCart: CartData[];
  error: string | null;
}

const initialState: CartState = {
  addToCartStatus: "idle",
  updateCartStatus: "idle",
  getCartStatus: "idle",
  clearAllCartStatus: "idle",
  clearProductStatus: "idle",
  cart: null,
  allCart: [],
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Add to Cart
    builder.
    
    addCase(addToCart.pending, (state) => {
      state.addToCartStatus = "isLoading";
    })
    .addCase(addToCart.fulfilled, (state, action) => {
      state.addToCartStatus = "succeeded";
      state.allCart = [...state.allCart, action.payload];
    })
    .addCase(addToCart.rejected, (state, action) => {
      state.addToCartStatus = "failed";
      state.error = action.error.message ?? "Failed to add to cart";
    })

    // ✅ Update Cart
    .addCase(updateCart.pending, (state) => {
      state.updateCartStatus = "isLoading";
    })
    .addCase(updateCart.fulfilled, (state, action) => {
      state.updateCartStatus = "succeeded";
      state.cart = action.payload;
    })
    .addCase(updateCart.rejected, (state, action) => {
      state.updateCartStatus = "failed";
      state.error = action.error.message ?? "Failed to update cart";
    })

    // ✅ Get Cart
    .addCase(getCart.pending, (state) => {
      state.getCartStatus = "isLoading";
    })
    .addCase(getCart.fulfilled, (state, action) => {
      state.getCartStatus = "succeeded";
      state.cart = action.payload;
    })
    .addCase(getCart.rejected, (state, action) => {
      state.getCartStatus = "failed";
      state.error = action.error.message ?? "Failed to get cart";
    })

    // ✅ Clear Cart
    .addCase(clearAllCart.pending, (state) => {
      state.clearAllCartStatus = "isLoading";
    })
    .addCase(clearAllCart.fulfilled, (state) => {
      state.clearAllCartStatus = "succeeded";
      state.allCart = [];
      state.cart = null;
    })
    .addCase(clearAllCart.rejected, (state, action) => {
      state.clearAllCartStatus = "failed";
      state.error = action.error.message ?? "Failed to clear cart";
    })

    // ✅ Clear Product from Cart
    .addCase(clearProduct.pending, (state) => {
      state.clearProductStatus = "isLoading";
    })
    .addCase(clearProduct.fulfilled, (state, action) => {
      state.clearProductStatus = "succeeded";
      state.allCart = state.allCart.filter(
        (item) => item._id !== action.payload._id
      );
    })
    .addCase(clearProduct.rejected, (state, action) => {
      state.clearProductStatus = "failed";
      state.error = action.error.message ?? "Failed to clear product";
    })
  }
});

export default cartSlice.reducer;
