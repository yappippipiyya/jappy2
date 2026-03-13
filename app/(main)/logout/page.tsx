"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { handleSignOut } from "@/app/lib/actions/handleSignOut";
import { useAlert } from "@/app/ui/CustomAlert"


export default function LogoutPage() {
  const router = useRouter();
  const { fire } = useAlert();

  useEffect(() => {
    const showModal = async () => {
      const result = await fire({
        title: "ログアウト",
        text: "ログアウトしてもよろしいですか？",
        materialIconName: "logout",
        confirmText: "ログアウト",
        confirmColor: "text-red-500 border-red-500"
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

  return (<></>);
}