import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Shop4U – Fashion & Lifestyle",
  description: "Shop4U – Your one-stop destination for fashion, electronics, home & more",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1.5rem 3rem" }}>
          {children}
        </main>
        <ChatWidget />
      </body>
    </html>
  );
}
