'use client'

import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Link from "next/link";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import Modal from "../modal/page";
import { IoMdClose } from "react-icons/io";

const TopBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null); // Manage user state
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check user data in localStorage on component mount
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
    setUser(storedUser);
    
    // Listen to the scroll event
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignout = () => {
    dispatch(startLoading());

    try {
      // Clear user data from storage
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("userData"); // Remove stored user data
      
      // Clear the user state
      setUser(null); // Update state to reflect user is signed out

      // Show success toast
      toast.success("Signed out successfully!");

      // Redirect user to homepage after a slight delay (to ensure toast shows)
      setTimeout(() => {
        router.push("/");
      }, 3000); // 500ms delay before redirecting
    } catch (error) {
      console.error("Signout Error:", error);
      toast.error("Sign out failed. Please try again.");
    } finally {
      dispatch(stopLoading());
    }
  };


  const handleMenu = () => {
    dispatch(startLoading());
    setTimeout(() => {
      setOpen((prev) => !prev);
    }, 3000); 
    dispatch(stopLoading());
  }

  return (
    <div>
      <div className="hidden lg:flex w-full">
        <div
        className={`fixed z-50 w-full h-20 px-3 py-1.5 gap-x-8 flex items-center transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
      >
        <div className="w-[20%]">
          <Image
            src="/image/logo.png"
            alt="stonepay-admin-app"
            width={100}
            height={100}
            className="object-contain w-full"
            quality={100}
            priority
          />
        </div>

        <div className={`w-[50%] rounded-lg border-2 bg-transparent flex items-center p-2 ${scrolled ? "border-black" : "border-white"}`}>
          <input
            type="text"
            placeholder="Search..."
            className="border-none outline-none bg-transparent w-full px-2"
          />
          <button className="bg-black text-white flex items-center justify-center rounded-lg px-3 py-1">
            <IoSearch size={20} />
          </button>
        </div>

        <div className="lg:w-[30%] sm:w-[15%] flex justify-end items-center gap-x-5">
          {user ? (
            <div
              onClick={handleSignout}
              className={`rounded-lg capitalize py-3 px-5 font-bold cursor-pointer transition-all duration-300 ${
                scrolled ? "border border-red-500 bg-transparent text-red-500" : "bg-red-500 text-white"
              }`}
            >
              Sign out
            </div>
          ) : (
            <div className="flex items-center gap-x-3">
              <Link
                href="/auth/sign-up"
                className={`rounded-lg border-2 capitalize py-3 px-5 font-bold cursor-pointer ${
                  scrolled ? "text-black bg-transparent" : "bg-transparent border-white text-black"
                }`}
              >
                Sign up
              </Link>
              <Link
                href="/auth/sign-in"
                className={`${
                  scrolled ? "bg-black text-white" : "bg-white text-black"
                } rounded-lg capitalize py-3 px-5 font-bold cursor-pointer`}
              >
                Sign in
              </Link>
            </div>
          )}

          <div className={
            ` relative flex items-center justify-center h-10 w-10 rounded-full ${!scrolled ? "bg-white" : "bg-primary-1"}` 
            }
          >

            <IoBagCheckOutline className={
              `font-bold ${!scrolled ? "text-primary-1 " : "text-white "}`
              } 
              size={25}
            />

            <div className={`absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold  rounded-full ${scrolled ? "bg-white text-primary-1" : "bg-primary-1 text-white"}`}>
              12
            </div>
          </div>
        </div>
        </div>
      </div>
      <div className="flex lg:hidden w-full">
        <div className="w-full h-16 bg-white p-3">
          <div className="w-full flex items-center justify-between">
            <div className="w-[40%]">
              <Image
                src="/image/logo.png"
                alt="stonepay-admin-app"
                width={100}
                height={100}
                className="object-contain w-full"
                quality={100}
                priority
              />
            </div>
            <div
              onClick={handleMenu}
            >
              <IoMdMenu className="text-primary-1 font-bold" size={30}/>
            </div>
          </div>
        </div>
      </div>
      {
        open && (
          <Modal onClose={handleMenu} visible={open}>
          <div className="w-full h-screen flex">
            <div className="w-full h-full  p-5 relative">
              <div className="w-[50%]">
                <Image
                  src="/image/logo.png"
                  alt="stonepay-admin-app"
                  width={100}
                  height={100}
                  className="object-contain w-full"
                  quality={100}
                  priority
                />
              </div>
              <div className="p-5 w-full">
                {
                  !user ? (
                    <div className="w-full">
                      <div className="py-3 flex items-center gap-x-3  font-semibold border-b-2 border-primary-1 text-gray-700 capitalize">
                      sign up
                      </div>
                      <div className="py-3 flex items-center gap-x-3  font-semibold border-b-2 border-primary-1 text-gray-700 capitalize">
                        sign in
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="py-3 flex items-center gap-x-3  font-semibold text-red-500 capitalize"
                      onClick={handleSignout}
                    >
                      sign out
                    </div>
                  )
                }
              </div>

              {/* Close icon */}
              <button
                className="absolute top-5 right-0 text-primary-1 font-bold text-2xl"
                onClick={handleMenu}
              >
                <IoMdClose size={25}/>
              </button>
            </div>
          </div>
        </Modal>
        )
      }
    </div>
  );
};

export default TopBar;
