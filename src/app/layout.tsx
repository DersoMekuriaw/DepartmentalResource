'use client';

import Navbar from "@/components/Navbar";
import "./globals.css";
import { store } from "./store/store";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Provider store = {store}>
            {children}
          </Provider>
      </body>
    </html>
  );
}
