import "../styles/globals.css";
import { Inter } from "next/font/google";

import ClientProviders from "./ClientProviders";
import { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Escher | Challenge",
  description: "Challenge.",
  keywords: "riddles",
  metadataBase: new URL("https://escher.com"),
  openGraph: {
    title: "Escher | Challenge",
    description:
      "Challenge",
    url: "https://escher.com",
    siteName: "Escher",
    type: "website",
    locale: "en_US",
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  creator: "Benjamin Azoulay",
  applicationName: "Escher",
  generator: "Next.js",
  publisher: "Escher",
  category: "Finance, Decentralized Finance",
};

export const viewport: Viewport = {
  themeColor: "#6B46C1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="escher">
      <body className={inter.className}>
        <ClientProviders>
          <Navbar />
          <main className="mb-16 sm:mb-0">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
