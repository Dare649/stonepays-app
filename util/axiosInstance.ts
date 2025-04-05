import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Function to handle session expiration
const handleSessionExpiration = () => {
  toast.warning("Your session has expired. Please log in again.", {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
  });

  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/auth/sign-in";
  }
};

// Request interceptor to add token if available
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    }
    return request;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

      // Ensure `data` is correctly typed
      const errorMessage = (data as { message?: string })?.message || "An error occurred.";

      switch (status) {
        case 401:
          handleSessionExpiration();
          break;

        case 403:
          toast.error("You do not have permission to perform this action.", {
            position: "top-right",
            autoClose: 3000,
          });
          break;

        case 500:
          toast.error("Server error. Please try again later.", {
            position: "top-right",
            autoClose: 3000,
          });
          break;

        default:
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
      }
    } else {
      toast.error("Network error. Please check your connection.", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
