"use client";

import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { joinBand } from "@/app/lib/actions/band";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  useEffect(() => {
    const handlejoin = async () => {
      const params = await props.params;
      const token = params.id;

      const success = await joinBand(token)

      router.push("/")
    };
    handlejoin();
  }, [props, router])


  return (
    <>
      <Navber />
      <div className="flex justify-center items-center h-screen">
        <p>処理中...</p>
      </div>
      <Footer />
    </>
  )
}