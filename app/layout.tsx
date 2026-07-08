import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "멀티벤더 쇼핑몰",
  description: "판매자들이 입점 가능한 멀티벤더 쇼핑몰",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
