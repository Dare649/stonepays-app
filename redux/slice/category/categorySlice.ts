import { createSlice } from "@reduxjs/toolkit";
import {
    getAllCategory
} from "./category";


  
  interface CategoryData {
    _id?: string;
    id?: string;
    category_name: string;
  }


interface OrderState {
    getAllCategoryStatus: "idle" | "isLoading" | "succeeded" | "failed";
    category: CategoryData | null;
    allCategory: CategoryData[];
    error: string | null;
}


const initialState: OrderState = {
    getAllCategoryStatus: "idle",
    category: null,
    allCategory: [],
    error: null,
}



const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getAllCategory.pending, (state) => {
                state.getAllCategoryStatus = "isLoading";
            })
            .addCase(getAllCategory.fulfilled, (state, action) => {
                state.getAllCategoryStatus = "succeeded";
                state.allCategory = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure it's an array
            })            
            .addCase(getAllCategory.rejected, (state, action) => {
                state.getAllCategoryStatus = "failed";
                state.error = action.error.message ?? "Failed to get all category";
            })
    },
});

export default categorySlice.reducer;