import { Noto_Sans_JP } from "next/font/google";
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
      <body
        className={`${notoSansJp.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
