"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { handleSignOut } from "@/app/lib/actions/handleSignOut";
import Navber from "@/app/ui/navber";
import Footer from "@/app/ui/footer";
import { useAlert } from "@/app/ui/CustomAlert"


export default function LogoutPage() {
  const router = useRouter();
  const { fire } = useAlert();

  useEffect(() => {
    const showModal = async () => {
      const result = await fire({
        title: "ログアウトしてよろしいですか？",
        confirmText: "ログアウト",
        cancelText: "キャンセル",
      });
      if (result.isConfirmed) {
        handleSignOut();
        router.push("/login")
      } else {
        router.push("/settings")
      }
    };

    showModal()
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      <Navber />
      <Footer />
    </main>
  );
}