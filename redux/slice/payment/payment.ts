import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";


interface InitializePayment {
    order_id: string;
}


export const initializePayment = createAsyncThunk(
    "payment/initializePayment", 
    async (data: InitializePayment, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post( 
                `/palmpay/initiate_payment`, data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to initialize payment, try again"
            });
        }
    }
);

export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment", 
    async (data: {
        order_id: string;
    orderNo: string;
    }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post( 
                `/palmpay/verify_payment`, data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to verify payment, try again"
            });
        }
    }
);


  