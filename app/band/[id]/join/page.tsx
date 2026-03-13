"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { joinBand } from "@/app/lib/actions/band";


export default function Page(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  useEffect(() => {
    const handlejoin = async () => {
      const params = await props.params;
      const token = params.id;

      const success = await joinBand(token)

      router.push("/")

      success
        ? toast.success("参加しました！")
        : toast.error("バンドに参加できませんでした。")

    };
    handlejoin();
  }, [props, router])


  return (
    <div className="flex justify-center items-center h-screen">
      <p>処理中...</p>
    </div>
  )
}