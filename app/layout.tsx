import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "sonner";
import { AlertProvider } from "@/app/ui/CustomAlert"
import "@/app/ui/globals.css";

import Navber from "@/app/ui/navbar"
import Footer from "@/app/ui/footer"


const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${notoSansJp.className} antialiased`}>
        <main className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
          <Navber />

          <AlertProvider>
          {children}
          <Toaster
            richColors
            position="top-right"
            theme="system"
            closeButton
            toastOptions={{
              className: "mt-22"
            }}
          />
          </AlertProvider>

          <Footer />
        </main>
      </body>
    </html>
  );
}
