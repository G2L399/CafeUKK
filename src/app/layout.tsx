"use client"
// import { useEffect } from "react";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useEffect(() => {
  //   // Check for previously saved theme preference
  //   const savedTheme = localStorage.getItem("theme");
  //   if (savedTheme) {
  //     document.body.classList.add(savedTheme);
  //   }

  //   // Function to handle the toggle
  //   const toggleTheme = () => {
  //     document.body.classList.toggle("dark");
  //     if (document.body.classList.contains("dark")) {
  //       localStorage.setItem("theme", "dark");
  //     } else {
  //       localStorage.removeItem("theme");
  //     }
  //   };

  //   // Adding the button to toggle dark/light mode
  //   const button = document.createElement("button");
  //   button.innerText = "Toggle Dark/Light Mode";
  //   button.style.padding = "10px 20px";
  //   button.style.fontSize = "16px";
  //   button.style.cursor = "pointer";
  //   button.style.marginTop = "20px";
  //   button.onclick = toggleTheme;

  //   document.body.prepend(button); // Add the button to the body

  //   // Cleanup on component unmount
  //   return () => {
  //     button.remove();
  //   };
  // }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
