'use client';

//import type { Metadata } from "next";
import TopBar from "@/components/topBar/page";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import LoadingOverlay from "@/components/loading/page";
import Footer from "@/components/footer/page";



// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-primary w-full`}>
        <Provider store={store}>
          <LoadingOverlay />
          <TopBar/>
          {children}
        </Provider>
        <Footer/>
      </body>
    </html>
  );
}
