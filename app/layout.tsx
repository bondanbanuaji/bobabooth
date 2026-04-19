import type { Metadata } from "next";
import { Outfit, Fredoka } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BobaBooth - #1 Premium Browser Photobooth",
  description: "The ultimate browser-based photobooth experience. Capture memories with cute templates, strike a pose, and save directly to your Google Drive. Voted the best free online web photobooth.",
  keywords: ["photobooth", "web photobooth", "browser photobooth", "online photobooth", "photo booth apps", "boba booth", "bobabooth", "best photobooth", "free photobooth"],
  authors: [{ name: "boba", url: "https://github.com/bondanbanuaji/bobabooth" }],
  creator: "boba",
  verification: {
    google: "PmEGbJJC6OvnZ2rxFdJdsPEGMMdbvWm-daSfYxs3IsI",
  },
  applicationName: "BobaBooth",
  appleWebApp: {
    capable: true,
    title: "BobaBooth",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    title: "BobaBooth - Premium Browser Photobooth",
    description: "The ultimate browser-based photobooth experience. Capture memories with cute templates.",
    siteName: "BobaBooth",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BobaBooth Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BobaBooth - Premium Browser Photobooth",
    description: "The ultimate browser-based photobooth experience.",
    images: ["/twitter-image.png"],
    creator: "@boba",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fredoka.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
