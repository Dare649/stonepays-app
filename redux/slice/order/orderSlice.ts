import { createSlice } from "@reduxjs/toolkit";
import {
    createOrder,
    deleteOrder,
    getAllOrder,
    getOrder,
    updateOrder
} from "./order";



interface Products {
    product_id: string;
    quantity: number;
    price: number;
}
  
  interface OrderData {
    _id?: string;
    id?: string;
    user_id: string;
    temp_order_id: null;
    products: Products[];
    total_price: number;
  }


interface OrderState {
    createOrderStatus: "idle" | "isLoading" | "succeeded" | "failed";
    updateOrderStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getOrderStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getAllOrderStatus: "idle" | "isLoading" | "succeeded" | "failed";
    deleteOrderStatus: "idle" | "isLoading" | "succeeded" | "failed";
    order: OrderData | null;
    allOrder: OrderData[];
    error: string | null;
}


const initialState: OrderState = {
    createOrderStatus: "idle",
    updateOrderStatus: "idle",
    getOrderStatus: "idle",
    getAllOrderStatus: "idle",
    deleteOrderStatus: "idle",
    order: null,
    allOrder: [],
    error: null,
}



const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ Create Vehicle Log
            .addCase(createOrder.pending, (state) => {
                state.createOrderStatus = "isLoading";
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.createOrderStatus = "succeeded";
                state.allOrder = Array.isArray(state.allOrder)
                    ? [...state.allOrder, action.payload]
                    : [action.payload]; // ✅ Ensure it's always an array
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.createOrderStatus = "failed";
                state.error = action.error.message ?? "Failed to create order";
            })

            .addCase(updateOrder.pending, (state) => {
                state.updateOrderStatus = "isLoading";
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.updateOrderStatus = "succeeded";
                state.allOrder = Array.isArray(state.allOrder)
                    ? state.allOrder.map((log) =>
                          log._id === action.payload._id ? action.payload : log
                      )
                    : [action.payload];
            
                if (state.order?._id === action.payload._id) {
                    state.order = action.payload;
                }
            })
            
            .addCase(updateOrder.rejected, (state, action) => {
                state.updateOrderStatus = "failed";
                state.error = action.error.message ?? "Failed to update order";
            })

            .addCase(getOrder.pending, (state) => {
                state.getOrderStatus = "isLoading";
            })
            .addCase(getOrder.fulfilled, (state, action) => {
                state.getOrderStatus = "succeeded";
                state.order = action.payload;
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.getOrderStatus = "failed";
                state.error = action.error.message ?? "Failed to get order";
            })


            .addCase(getAllOrder.pending, (state) => {
                state.getAllOrderStatus = "isLoading";
            })
            .addCase(getAllOrder.fulfilled, (state, action) => {
                state.getAllOrderStatus = "succeeded";
                state.allOrder = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure it's an array
            })            
            .addCase(getAllOrder.rejected, (state, action) => {
                state.getAllOrderStatus = "failed";
                state.error = action.error.message ?? "Failed to get all order";
            })

            // ✅ Delete Vehicle Log
            .addCase(deleteOrder.pending, (state) => {
                state.deleteOrderStatus = "isLoading";
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.deleteOrderStatus = "succeeded";
                state.allOrder = Array.isArray(state.allOrder)
                    ? state.allOrder.filter((log) => log._id !== action.payload)
                    : [];
            
                if (state.order?._id === action.payload) {
                    state.order = null; // ✅ Remove if currently selected
                }
            })
            
            .addCase(deleteOrder.rejected, (state, action) => {
                state.deleteOrderStatus = "failed";
                state.error = action.error.message ?? "Failed to delete order";
            });
    },
});

export default orderSlice.reducer;