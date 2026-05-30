import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NasaanAko.ph — Find Yourself in the Philippines",
  description: "A GeoGuessr-style geography game for the Philippines.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">{children}</body>
    </html>
  );
}
