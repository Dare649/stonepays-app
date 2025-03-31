import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";

interface PaymentState {
  loading: boolean;
  error: string | null;
  paymentData: any;
  verificationData: any;
}

interface InitializePayment {
  order_id: string;
}

interface VerifyPayment {
  order_id: string;
  orderNo: string;
}

// 🟢 Step 1: Initialize Payment
export const initializePayment = createAsyncThunk(
  "payment/initializePayment",
  async (data: InitializePayment, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/palmpay/initiate_payment`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to initialize payment, try again",
      });
    }
  }
);

// 🟢 Step 2: Verify Payment
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (data: VerifyPayment, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/palmpay/verify_payment`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to verify payment, try again",
      });
    }
  }
);

// 🟢 Step 3: Create Payment Slice
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    paymentData: null,
    verificationData: null,
  } as PaymentState,
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.paymentData = null;
      state.verificationData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Payment
      .addCase(initializePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = "Error initializing payment";
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationData = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = "Error verifying payment";
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
