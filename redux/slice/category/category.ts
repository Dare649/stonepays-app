import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";


// Get all Category
export const getAllCategory = createAsyncThunk(
    "Category/getAllCategory", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/product-category/get_product_categoryies`
            );
            return response.data.data; 
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get orders, try again"
            });
        }
    }
);

  