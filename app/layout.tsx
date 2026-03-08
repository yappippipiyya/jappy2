import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "sonner";
import { AlertProvider } from "@/app/ui/CustomAlert"
import "@/app/ui/globals.css";

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
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${notoSansJp.className} antialiased`}>
        <AlertProvider>
        {children}
        <Toaster
          richColors
          position="top-right"
          theme="system"
          duration={2000}
          toastOptions={{
            className: "mt-22"
          }}
        />
        </AlertProvider>
      </body>
    </html>
  );
}
