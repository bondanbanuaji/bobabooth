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
  openGraph: {
    type: "website",
    title: "BobaBooth - Premium Browser Photobooth",
    description: "The ultimate browser-based photobooth experience.",
    siteName: "BobaBooth",
  },
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
