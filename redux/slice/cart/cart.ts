import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";


interface Products {
    product_id: string;
    quantity: number;
    price: number;
}
  
  interface Order {
    user_id: string;
    temp_order_id: null;
    products: Products[];
    total_price: number;
  }


  interface ClearCartArgs {
    productId: string;
    userId: string;
  }
  



export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (data: Order, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/cart/add_cart",
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to add to cart, try again"
            });
        }
    }
);



export const updateCart = createAsyncThunk(
    "cart/updateCart",
    async (data: Order, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                "/cart/update_cart",
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to update cart, try again"
            });
        }
    }
);


export const getCart = createAsyncThunk(
    "cart/getCart",
    async (userId: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/cart/get_cart/${userId}`);
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  


  export const clearAllCart = createAsyncThunk(
    "cart/clearAllCart",
    async ({ productId, userId }: ClearCartArgs, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(
          `/cart/remove_product_cart/${productId}/${userId}`
        );
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue({
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to delete cart, try again",
        });
      }
    }
  );


  export const clearProduct = createAsyncThunk(
    "cart/clearCart",
    async (productId: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(
          `/cart/clear_cart/${productId}`
        );
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue({
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to delete cart, try again",
        });
      }
    }
  );



  