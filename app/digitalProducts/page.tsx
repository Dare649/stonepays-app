

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { ProductData } from "@/redux/slice/product/productSlice";
import { useSearchParams } from "next/navigation";
import { toast } from 'react-toastify';
import { createOrder } from "@/redux/slice/order/order";
import { useRouter } from "next/navigation";
import axiosInstance from "@/util/axiosInstance";
import { IoBagCheckOutline } from "react-icons/io5";
import { ShoppingCartIcon, HeartIcon } from 'lucide-react'

type DigitalProductsProps =  {
  products: ProductData[];
}

interface Products {
  product_id: string;
  quantity: number;
  price: number;
  product_category: string;
}

interface FormState {
  user_id: string;
  temp_order_id: null;
  products: Products[];
  total_price: number;
}

const ITEMS_PER_PAGE = 10;

const DigitalProducts= ({ products }: DigitalProductsProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const [orderId, setOrderId] = useState<string>("");
  const [mockCheckoutUrl, setMockCheckoutUrl] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
 


  const [formData, setFormData] = useState<FormState>({
    user_id: user._id || "",
    temp_order_id: null,
    products: [],
    total_price: 1,
  })

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = products.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handlePageChange = (selected: { selected: number }) => {
    dispatch(startLoading());
    setTimeout(() => {
      setCurrentPage(selected.selected);
      dispatch(stopLoading());
    }, 2000);
  };

  const handleBuyNow = (product: ProductData) => {
   
    if (user && user._id) {
      dispatch(startLoading());
      setTimeout(() => {
        setSelectedProduct(product);
        setQuantity(1);
        dispatch(stopLoading());
      }, 2000);
    } else {
      toast.warn("Sign in to place an order")
      router.push("/auth/sign-in")
    }
    
  };

  const handleBackToShop = () => {
    dispatch(startLoading());
    setTimeout(() => {
      setSelectedProduct(null);
      setQuantity(1);
      dispatch(stopLoading());
    }, 2000);
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) => (type === "increase" ? prev + 1 : Math.max(1, prev - 1)));
  };

  
  
  const handleCreateOrder = async () => {
    if (!selectedProduct || !user) {
      return toast.error("User or product not selected");
    }
  
    const formData: FormState = {
      user_id: user._id || "",
      temp_order_id: null,
      products: [
        {
          product_id: selectedProduct._id || "",
          quantity: quantity,
          price: selectedProduct.product_price,
          product_category: selectedProduct.product_category,
        },
      ],
      total_price: selectedProduct.product_price * quantity,
    };
  
    dispatch(startLoading());
  
    try {
      // 🟢 Step 1: Create Order
      console.log("Creating order...");
      const orderResponse = await dispatch(createOrder(formData)).unwrap();
      console.log("✅ Order response:", orderResponse);
  
      const newOrderId = orderResponse?.data?._id;
      if (!newOrderId || !isValidObjectId(newOrderId)) {
        throw new Error("Invalid Order ID received from backend");
      }
  
      setOrderId(newOrderId);
      toast.success("Order placed successfully!");
  
      // 🟢 Step 2: Initialize Payment
      console.log("✅ Initializing payment with orderId:", newOrderId);
      
      const initiatePayment = async (orderId: string) => {
        try {
          const response = await axiosInstance.post('/palmpay/initiate_payment', { order_id: orderId });
  
          console.log('Payment initiation response:', response.data);
  
          const { orderNo, mockCheckoutUrl } = response.data.data.data;
          if (!orderNo || !mockCheckoutUrl) {
            throw new Error("Payment initialization failed: Missing orderNo or mockCheckoutUrl.");
          }
  
          // 🟢 Append return URL so the user comes back to the app after payment
          const returnUrl = encodeURIComponent("https://stonepays-app.vercel.app"); // Change this to your actual return URL
          const redirectUrl = `${mockCheckoutUrl}&returnUrl=${returnUrl}`;
  
          return { orderNo, redirectUrl };
        } catch (error: any) {
          console.error('❌ Error initiating payment:', error.response?.data || error.message);
          throw error;
        }
      };
  
      const { orderNo, redirectUrl } = await initiatePayment(newOrderId);
  
      setMockCheckoutUrl(redirectUrl);
      toast.success("Payment initialized successfully!");
  
      // 🟢 Save `orderNo` & `orderId` for verification
      localStorage.setItem("orderNo", orderNo);
      localStorage.setItem("orderId", newOrderId);
  
      // Redirect to PalmPay checkout
      window.location.href = redirectUrl;
    } catch (error: any) {
      console.error("❌ Error in handleCreateOrder:", error);
      toast.error(error.message || "Something went wrong, try again.");
    } finally {
      dispatch(stopLoading());
    }
  };
  
  // 🟢 Function to Validate MongoDB ObjectId
  const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);
  
  // ✅ Step 3: Verify Payment After Redirect
  useEffect(() => {
    if (!isPaymentConfirmed) {
      console.log("⚠ Payment verification skipped: User has not confirmed payment.");
      return;
    }
  
    const orderNo = localStorage.getItem("orderNo");
    const orderId = localStorage.getItem("orderId");
  
    if (!orderNo || !orderId) {
      console.warn("⚠ Payment verification skipped: Missing orderNo or orderId.");
      return;
    }
  
    console.log("🔍 Attempting to verify payment with:", { orderId, orderNo });
  
    const verifyPayment = async () => {
      try {
        const response = await axiosInstance.post("/palmpay/verify_payment", {
          order_id: orderId,
          orderNo: orderNo,
        });
  
        // 🔥 Log full response
        console.log("✅ Full Payment Verification Response:", response);
  
        // 🔥 Log only response data
        console.log("✅ Payment Verification Data:", response.data);
  
        if (response.data.respCode !== "00000000") {
          throw new Error(`Payment verification failed: ${response.data.respMsg || "Unknown error"}`);
        }
  
        const { orderStatus, payStatus, message } = response.data.data;
  
        if (orderStatus === 1 && payStatus === 3) {
          toast.success("✅ Payment verified successfully! Redirecting...");
          localStorage.removeItem("orderNo");
          localStorage.removeItem("orderId");
  
          // Redirect after successful payment
          setTimeout(() => {
            window.location.href = "/digital-products"; // Update with correct path
          }, 2000);
        } else if (orderStatus === 3) {
          console.warn("⏳ Payment pending. Retrying...");
          toast.info("⏳ Payment pending. Retrying verification...");
          setTimeout(verifyPayment, 10000);
        } else {
          console.error("❌ Payment failed:", message || "Unknown error.");
          toast.error("❌ Payment failed: " + (message || "Please contact support."));
        }
      } catch (error: any) {
        console.error("❌ Error verifying payment:", error.response || error);
        console.log("❌ Error response data:", error.response?.data || "No additional data available.");
        toast.error("Payment verification failed. Please try again.");
      }
    };
  
    verifyPayment();
  }, [isPaymentConfirmed]); // This effect runs when isPaymentConfirmed is true
  
  
  const formatNumber = (num: number) => {
    return Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  



    

  return (
    <div className="w-full flex flex-col">
      {/* check out section */}
      {selectedProduct ? (
        <div className="w-full">
        <button 
          className="mb-4 px-4 py-2 bg-primary-1 text-white rounded cursor-pointer" 
          onClick={handleBackToShop}
        >
          ← Back to Shop
        </button>
        <div className="w-full flex lg:flex-row sm:flex-col items-start gap-5">
          {/* Product Image Section */}
          <div className="lg:w-[50%] sm:w-full">
            <Image
              src={selectedProduct.product_img}
              alt={selectedProduct.product_name}
              width={300}
              height={300}
              priority
              className="object-contain w-full rounded-lg"
            />
          </div>
          {/* Product Details Section */}
          <div className="lg:w-[50%] sm:w-full">
            <h3 className="text-2xl font-semibold capitalize text-gray-900">{selectedProduct.product_name}</h3>
            <p className="text-primary-1 font-bold mt-2 text-xl">
              ${formatNumber(selectedProduct.product_price)}
            </p>
            <div className="flex flex-col justify-end mt-4">
              {/* Quantity Section */}
              <div className="flex items-center gap-x-2 mb-4">
                <h2 className="text-lg font-semibold">Quantity:</h2>
                <div className="flex items-center border-2 border-gray-300 rounded">
                  <button 
                    className="px-4 py-2 hover:bg-primary-1 hover:text-white cursor-pointer"
                    onClick={() => handleQuantityChange("decrease")}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x-2 border-gray-300">{quantity}</span>
                  <button 
                    className="px-4 py-2 hover:bg-primary-1 hover:text-white cursor-pointer"
                    onClick={() => handleQuantityChange("increase")}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Total Price Section */}
              <h2 className="text-lg font-semibold flex items-center gap-x-2">
                <span>Total Price:</span>
                <span className="text-xl font-bold">${selectedProduct ? (selectedProduct.product_price * quantity).toFixed(2) : "0.00"}</span>
              </h2>
            </div>
            {/* Confirm Purchase Button */}
            <button 
              className="mt-4 w-full px-4 py-2 bg-primary-1 text-white rounded-lg font-semibold"
              onClick={handleCreateOrder}
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
      ) : (
        <>
          

          <div className="grid lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2 gap-5">
            {currentItems.map((item) => (
              <div key={item._id} className="group">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={item.product_img}
                    alt={item.product_name}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  {/* Tags */}
                  
                  {/* Quick actions */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center sm:flex">
                    <button className="bg-white border-2 border-black flex items-center px-2 gap-x-1 text-gray-900 p-2 rounded-full mx-1 hover:bg-gray-100 capitalize cursor-pointer text-xs font-bold">
                      <ShoppingCartIcon size={18} />
                      <span className="text-xs font-bold">add to cart</span>
                    </button>
                    <button
                      className="bg-black text-white p-2 rounded-full mx-1 flex items-center px-2 gap-x-1 cursor-pointer"
                      onClick={() => handleBuyNow(item)}
                    >
                      <IoBagCheckOutline />
                      <span className="text-xs font-bold">Buy Now</span>
                    </button>
                  </div>

                </div>
                <div className="px-1">
                  <div className="text-sm font-bold text-gray-500 mb-1 capitalize">{item.product_category}</div>
                  <h3 className="font-bold text-gray-900 mb-1 capitalize">{item.product_name}</h3>
                  <div className="flex items-center gap-x-3">
                    <span className="font-medium">${formatNumber(item.product_price)}</span>
                    <span>
                      {item.product_qty === 0 ? (
                        <p className="text-red-500 font-semibold">Out of Stock</p>
                      ) : (
                        <p className="text-green-500 font-semibold">In Stock</p>
                      )}
                    </span>
                  </div>
                </div>
            </div>
            
            ))}
          </div>

          <div className="mt-8 flex justify-center cursor-pointer">
            <ReactPaginate
              previousLabel={"← Prev"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={"flex gap-2"}
              previousClassName={"px-3 py-1 bg-gray-300 rounded hover:bg-primary-1 hover:text-white"}
              nextClassName={"px-3 py-1 bg-gray-300 rounded hover:bg-primary-1 hover:text-white"}
              pageClassName={"px-3 py-1 border rounded"}
              activeClassName={"bg-primary-1 text-white"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DigitalProducts;
