import { createSlice } from "@reduxjs/toolkit";
import { signIn, signUp, verifyOtp, resendOtp, getSignedInUser } from "./auth";

interface Auth {
  _id?: string;
  first_name: string;
  last_name: string;
  role: string;
  designation: string;
  user_img: string;
  email: string;
  password: string;
}

interface AuthState {
  user: Auth | null; // Change from array to a single object
  token: string | null;
  signInStatus: "idle" | "isLoading" | "succeeded" | "failed";
  signUpStatus: "idle" | "isLoading" | "succeeded" | "failed";
  verifyOtpStatus: "idle" | "isLoading" | "succeeded" | "failed";
  resendOtpStatus: "idle" | "isLoading" | "succeeded" | "failed";
  getSignedInUserStatus: "idle" | "isLoading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null, // Change from an array to null
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  signInStatus: "idle",
  signUpStatus: "idle",
  verifyOtpStatus: "idle",
  resendOtpStatus: "idle",
  getSignedInUserStatus: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle sign in
      .addCase(signIn.pending, (state) => {
        state.signInStatus = "isLoading";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.signInStatus = "succeeded";
        state.token = action.payload.token.access_token;
        state.user = action.payload.user; // Save user info here
        localStorage.setItem("token", action.payload.token.access_token);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.signInStatus = "failed";
        state.error = action.error.message || "Failed to sign in, try again.";
      })

      // Handle fetching signed-in user
      .addCase(getSignedInUser.pending, (state) => {
        state.getSignedInUserStatus = "isLoading";
      })
      .addCase(getSignedInUser.fulfilled, (state, action) => {
        state.getSignedInUserStatus = "succeeded";
        state.user = action.payload; // Save fetched user data
      })
      .addCase(getSignedInUser.rejected, (state, action) => {
        state.getSignedInUserStatus = "failed";
        state.error = action.error.message || "Failed to get signed-in user.";
      })

      // Handle sign up
      .addCase(signUp.pending, (state) => {
        state.signUpStatus = "isLoading";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUpStatus = "succeeded";
        state.user = action.payload.user; // Save user info here
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUpStatus = "failed";
        state.error = action.error.message || "Failed to sign up, try again.";
      })

      // Handle OTP verification
      .addCase(verifyOtp.pending, (state) => {
        state.verifyOtpStatus = "isLoading";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verifyOtpStatus = "succeeded";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyOtpStatus = "failed";
        state.error =
          action.error.message || "OTP verification failed, try again.";
      })

      // Handle OTP resend
      .addCase(resendOtp.pending, (state) => {
        state.resendOtpStatus = "isLoading";
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendOtpStatus = "succeeded";
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendOtpStatus = "failed";
        state.error = action.error.message || "Failed to resend OTP, try again.";
      });
  },
});

export default authSlice.reducer;
