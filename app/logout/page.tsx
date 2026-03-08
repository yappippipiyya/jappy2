"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { handleSignOut } from "@/app/lib/actions/handleSignOut";
import Navber from "@/app/ui/navber";
import Footer from "@/app/ui/footer";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const showModal = async () => {
      const result = await Swal.fire({
        title: "ログアウトしてよろしいですか？",
        icon: "info",
        theme: "auto",
        showCancelButton: true,
        confirmButtonText: "ログアウト",
        cancelButtonText: "キャンセル",
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