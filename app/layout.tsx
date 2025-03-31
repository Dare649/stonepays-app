'use client';

import { useEffect, useState } from "react";
import TopBar from "@/components/topBar/page";
import "./globals.css";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import LoadingOverlay from "@/components/loading/page";
import Footer from "@/components/footer/page";
import { PersistGate } from "redux-persist/integration/react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = useState<string | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const excludedPaths = ["/", "/auth/sign-up", "/auth/verify-otp",  "/error"];

  return (
    <html lang="en">
      <body className="font-primary w-full">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LoadingOverlay />
            {pathname && !excludedPaths.includes(pathname) && <TopBar />}
            {children}
          </PersistGate>
        </Provider>
        {/* Only render footer when pathname is available and not in excludedPaths */}
        {pathname && !excludedPaths.includes(pathname) && <Footer />}
      </body>
    </html>
  );
}
