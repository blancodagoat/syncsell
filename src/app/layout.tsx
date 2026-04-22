import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "syncsell — never oversell again",
  description: "Multi-channel inventory sync for Shopify, Etsy, Amazon, and eBay sellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
