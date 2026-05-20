import type { Metadata } from "next";
import Providers from "@/context/Providers";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Printova",
    template: "%s | Printova",
  },

  description:
    "Printova is a full-stack e-commerce and maintenance booking platform for printer spare parts, repair services, and order management.",

  keywords: [
    "Printova",
    "printer spare parts",
    "printer maintenance",
    "e-commerce",
    "Next.js",
    "Spring Boot",
    "printer repair",
  ],

  authors: [{ name: "Youssef R." }],

  creator: "Youssef R.",

  metadataBase: new URL("https://printova.vercel.app"),

  openGraph: {
    title: "Printova",
    description:
      "Printer spare parts e-commerce & maintenance booking platform.",
    url: "https://printova.vercel.app",
    siteName: "Printova",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Printova",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Printova",
    description:
      "Printer spare parts e-commerce & maintenance booking platform.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased scroll-smooth" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex flex-col h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}