import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DropZone - Lost & Found",
  description: "Campus Lost and Found Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)] bg-gray-50">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
