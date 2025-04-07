import { createSlice } from "@reduxjs/toolkit";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getProduct,
    updateProduct
} from "./product";



export interface ProductData {
    _id?: string;
    id?: string;
    product_name: string;
    product_category_id: string;
    product_price: number;
    product_description: string;
    product_img: string,
    product_qty: number;
}


interface ProductState {
    createProductStatus: "idle" | "isLoading" | "succeeded" | "failed";
    updateProductStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getProductStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getAllProductStatus: "idle" | "isLoading" | "succeeded" | "failed";
    deleteProductStatus: "idle" | "isLoading" | "succeeded" | "failed";
    product: ProductData | null;
    allProduct: ProductData[];
    error: string | null;
}


const initialState: ProductState = {
    createProductStatus: "idle",
    updateProductStatus: "idle",
    getProductStatus: "idle",
    getAllProductStatus: "idle",
    deleteProductStatus: "idle",
    product: null,
    allProduct: [],
    error: null,
}



const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ Create Vehicle Log
            .addCase(createProduct.pending, (state) => {
                state.createProductStatus = "isLoading";
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.createProductStatus = "succeeded";
                state.allProduct = Array.isArray(state.allProduct)
                    ? [...state.allProduct, action.payload]
                    : [action.payload]; // ✅ Ensure it's always an array
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createProductStatus = "failed";
                state.error = action.error.message ?? "Failed to create product";
            })

            .addCase(updateProduct.pending, (state) => {
                state.updateProductStatus = "isLoading";
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.updateProductStatus = "succeeded";
                state.allProduct = Array.isArray(state.allProduct)
                    ? state.allProduct.map((log) =>
                          log._id === action.payload._id ? action.payload : log
                      )
                    : [action.payload];
            
                if (state.product?._id === action.payload._id) {
                    state.product = action.payload;
                }
            })
            
            .addCase(updateProduct.rejected, (state, action) => {
                state.updateProductStatus = "failed";
                state.error = action.error.message ?? "Failed to update product";
            })

            .addCase(getProduct.pending, (state) => {
                state.getProductStatus = "isLoading";
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.getProductStatus = "succeeded";
                state.product = action.payload;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.getProductStatus = "failed";
                state.error = action.error.message ?? "Failed to get product";
            })


            .addCase(getAllProduct.pending, (state) => {
                state.getAllProductStatus = "isLoading";
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.getAllProductStatus = "succeeded";
                state.allProduct = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure it's an array
            })            
            .addCase(getAllProduct.rejected, (state, action) => {
                state.getAllProductStatus = "failed";
                state.error = action.error.message ?? "Failed to get all products";
            })

            // ✅ Delete Vehicle Log
            .addCase(deleteProduct.pending, (state) => {
                state.deleteProductStatus = "isLoading";
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.deleteProductStatus = "succeeded";
                state.allProduct = Array.isArray(state.allProduct)
                    ? state.allProduct.filter((log) => log._id !== action.payload)
                    : [];
            
                if (state.product?._id === action.payload) {
                    state.product = null; // ✅ Remove if currently selected
                }
            })
            
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deleteProductStatus = "failed";
                state.error = action.error.message ?? "Failed to delete product";
            });
    },
});

export default productSlice.reducer;