import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NasaanAko.ph — Find Yourself in the Philippines",
  description: "Drop anywhere in the Philippines and guess where you are. A free GeoGuessr-style game for Pinoys. Libre at walang download!",
  metadataBase: new URL("https://www.nasaanako.ph"),
  openGraph: {
    title: "NasaanAko.ph — Find Yourself in the Philippines 🇵🇭",
    description: "Drop anywhere in the Philippines and guess where you are. Libre at walang download!",
    url: "https://www.nasaanako.ph",
    siteName: "NasaanAko.ph",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "NasaanAko.ph — Philippines Geography Game",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NasaanAko.ph — Find Yourself in the Philippines 🇵🇭",
    description: "Drop anywhere in the Philippines and guess where you are. Libre at walang download!",
    images: ["/og"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">{children}</body>
    </html>
  );
}
