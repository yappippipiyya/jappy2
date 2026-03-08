"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleSignOut } from "@/app/lib/actions/handleSignOut";
import Navber from "@/app/ui/navber";
import Footer from "@/app/ui/footer";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const isConfirmed = window.confirm("ログアウトしてよろしいですか？");

    if (isConfirmed) {
      handleSignOut();
      router.push("/login")
    } else {
      router.push("/settings")
    }
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      <Navber />
      <div className="grow flex items-center justify-center">
        <p className="text-zinc-500 animate-pulse text-sm">処理中...</p>
      </div>
      <Footer />
    </main>
  );
}