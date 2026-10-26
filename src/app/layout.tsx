import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeopardy! - The Classic Game Show",
  description: "An authentic, full-featured Jeopardy web game with Single, Double, and Final Jeopardy rounds, Daily Doubles, and sound effects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#020524] text-white">
      <body className="min-h-full flex flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
