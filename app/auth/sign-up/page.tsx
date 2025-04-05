'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { MdOutlineMail } from "react-icons/md";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { toast } from 'react-toastify';
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { signUp } from '@/redux/slice/auth/auth';
import Link from "next/link";
import ImageUploader from '@/components/image-upload/page';


interface FormState {
  first_name: string;
  role: string;
  last_name: string;
  user_img: string; // Base64 string
  email: string;
  password: string;
}


const images = [
  "/image/productImg.png",
  "/image/productImg1.png",
  "/image/productImg2.png",
];



const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch<any>(); // Explicit type for async dispatch
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const [formData, setFormData] = useState<FormState>({
    first_name: "",
    last_name: "",
    role: "user",
    user_img: "",
    email: "",
    password: "",
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

  

  // Toggle password visibility
  const togglePassword = () => setPasswordVisible((prev) => !prev);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    const { name, value } = 'target' in e ? e.target : e;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  // Handle image upload
  const handleImageUpload = (name: string, base64String: string) => {
    setFormData((prev) => ({
      ...prev,
      user_img: base64String,
    }));
  };

  // Handle sign up
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(startLoading());

    try {
      await dispatch(signUp(formData) as any);
      toast.success("Sign up successful!");
      localStorage.setItem("userEmail", formData.email); // Store email in localStorage
      router.push("/auth/verify-otp"); // Navigate to Verify OTP page
    } catch (error) {
      toast.error("Sign up failed!");
    } finally {
      dispatch(stopLoading());
    }
  };

  return (

    <div 
      className="w-full h-full flex items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${currentImage})` }}
    >
      <div className='sm:w-[90%] lg:w-[40%] border border-white rounded-xl bg-white/30 backdrop-blur-md shadow-lg p-8'>
      <div className="w-full flex flex-col items-center justify-center p-3">
          <div className="w-40 flex justify-center">
            <Image
              src={"/image/logo.png"}
              alt="User Profile"
              width={50}
              height={50}
              className="w-full"
              quality={100}
              priority
            />
          </div>
          <div className="w-full lg:mt-10 sm:mt-5">
            <h2 className="text-xl sm:text-2xl text-left font-semibold">
              Welcome, <br /> Sign up to get started.
            </h2>
          </div>
          <form className="w-full mt-5" onSubmit={handleSignup}>
            {/* Name Fields */}
            <div className="w-full flex items-center gap-5">
              <div className="sm:w-full lg:w-[50%] flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full outline-none border-none bg-transparent"
                  required
                />
                <CiUser size={25} className="text-gray-400 font-bold" />
              </div>
              <div className="sm:w-full lg:w-[50%] flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full outline-none border-none bg-transparent"
                  required
                />
                <CiUser size={25} className="text-gray-400 font-bold" />
              </div>
            </div>

            {/* Email */}
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full outline-none border-none bg-transparent"
                required
              />
              <MdOutlineMail size={25} className="text-gray-400 font-bold" />
            </div>


            {/* Profile Image Upload */}
            <div className="w-full mb-5">
              <ImageUploader
                id="user_img"
                name="user_img"
                text="Upload Profile Image"
                onChange={handleImageUpload}
              />
            </div>

            {/* Password */}
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full outline-none border-none bg-transparent"
                required
              />
              <div onClick={togglePassword} className="cursor-pointer">
                {passwordVisible ? <GoEye size={25} className="text-gray-400 font-bold" /> : <GoEyeClosed size={25} className="text-gray-400 font-bold" />}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-primary-1 text-white font-bold capitalize text-center py-5 rounded-lg">
              {isLoading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>
          <div className="flex justify-center mt-5">
            <p className="text-gray-400 font-bold first-letter:capitalize">
              Alreasy have an account?{" "}
              <Link href="/auth/sign-in" className="text-primary-1 first-letter:capitalize">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
