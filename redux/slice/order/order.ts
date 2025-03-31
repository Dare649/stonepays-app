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



export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (data: Order, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/order/create_order",
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to create order, try again"
            });
        }
    }
);

// Update Order
export const updateOrder = createAsyncThunk(
    "order/updateOrder", 
    async ({ id, data }: { id: string; data: Order }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put( 
                `/order/update_order/${id}`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to update order, try again"
            });
        }
    }
);

export const getOrder = createAsyncThunk(
    "order/getOrder",
    async (OrderId: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/order/get_order/${OrderId}`);
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

export const deleteOrder = createAsyncThunk<
    string, // Return type (ID of deleted item)
    string, // Argument type (ID to delete)
    { rejectValue: { message: string } } // Error type
>(
    "order/deleteOrder",
    async (id, { rejectWithValue }) => { 
        try {
            await axiosInstance.delete(
                `/order/delete_order/${id}`
            );
            return id; // Return the deleted ID
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to delete order, try again"
            });
        }
    }
);


// Get all Orders
export const getAllOrder = createAsyncThunk(
    "Order/getAllOrder", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/order/get_orders`
            );
            return response.data.data; 
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get orders, try again"
            });
        }
    }
);

  