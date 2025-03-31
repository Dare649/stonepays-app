"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoKeyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { RootState } from "@/redux/store";
import { verifyOtp, resendOtp } from "@/redux/slice/auth/auth";

interface FormState {
  email: string;
  otp: string;
}


const images = [
  "/image/productImg.png",
  "/image/productImg1.png",
  "/image/productImg2.png",
];

const VerifyOtp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const [formData, setFormData] = useState<FormState>({
    email: "",
    otp: "",
  });

  const [currentImage, setCurrentImage] = useState(images[0]);
    
  // Background image change effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setCurrentImage(images[index]);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);
  

  // Retrieve email from localStorage when component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  // Handle form input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle OTP verification
  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(startLoading());

    try {
      const result = await dispatch(verifyOtp(formData) as any).unwrap();

      if (result) {
        toast.success("OTP verification successful!");

        // Remove email from localStorage after successful verification
        localStorage.removeItem("userEmail");

        router.push("/");
      }
    } catch (error) {
      toast.error("OTP verification failed!");
    } finally {
      dispatch(stopLoading());
    }
  };

  // Handle resend OTP (only sending the email)
  const handleResendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(startLoading());

    try {
      const result = await dispatch(resendOtp({ email: formData.email }) as any).unwrap();

      if (result) {
        toast.success("Resent OTP successfully!");
      }
    } catch (error) {
      toast.error("Failed to resend OTP, try again!");
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${currentImage})` }}
    >
      <div className='w-[90%] md:w-[40%] border border-white rounded-xl bg-white/30 backdrop-blur-md shadow-lg p-8'>
      <div className="w-full max-w-md flex flex-col items-center justify-center p-3">
          <div className="w-40 flex justify-center">
            <Image
              src={"/stone1.png"}
              alt="User Profile"
              width={50}
              height={50}
              className="w-full"
              quality={100}
              priority
            />
          </div>
          <div className="w-full lg:mt-10 sm:mt-5">
            <h2 className="text-xl sm:text-2xl text-center font-semibold">
              An OTP has been sent to <span className="text-primary-2">{formData.email}</span>
            </h2>
          </div>
          <form className="w-full mt-5" onSubmit={handleVerifyOtp}>
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 bg-transparent lg:p-2 sm:p-1 mb-5">
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter your OTP"
                className="w-full outline-none border-none bg-transparent"
                required
              />
              <IoKeyOutline size={25} className="text-gray-400 font-bold" />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-1 text-white font-bold capitalize text-center hover:border-2 rounded-lg hover:bg-transparent hover:text-primary-1 hover:border-primary-1 py-5 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Verify OTP"}
            </button>
          </form>
          <div className="flex justify-center mt-5">
            <p className="text-gray-400 font-bold first-letter:capitalize">
              <span>Didn't receive OTP?{" "}</span>
              <span  
                onClick={handleResendOtp}
                className="text-primary-1 font-bold cursor-pointer"
              >
                Resend OTP
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default VerifyOtp;
