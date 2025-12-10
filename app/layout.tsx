import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"



export const metadata: Metadata = {
  title: " Shortcuts j@",
  description: "create shortcuts, Format and validate Json schema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` antialiased`}
      >
      <Toaster/>
      <Analytics/>
        {children}
      </body>
    </html>
  );
}
