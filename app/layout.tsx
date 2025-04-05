"use client";

import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import LoadingOverlay from "@/components/loading/page";
import TopBar from "@/components/topBar/page";
import Footer from "@/components/footer/page";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const excludedPaths = ["/auth/sign-in", "/auth/sign-up", "/auth/verify-otp", "/error"];

  return (
    <html lang="en">
      <body className="font-primary w-full">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
           <LoadingOverlay />
           <ToastContainer position="top-center" autoClose={3000} />
            {children}
            {/* Only show Footer when pathname is available and not excluded */}
            {!excludedPaths.includes(pathname) && <Footer />}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
