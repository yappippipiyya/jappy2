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
      <body
        className={`${notoSansJp.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
