import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from 'next/image';

import notFoundPic from '@/public/notFound.png'

import { fetchUser } from "@/app/lib/services/user"

import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"


export default async function Page() {
  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  return (
    <main className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
      <Navber />

      <div className="flex flex-col">
        <div className="mx-5 mt-5">
          <p className="text-7xl font-bold my-1">404</p>
          <p className="text-4xl font-semibold my-1">Not Found!</p>
        </div>
        <div className="m-5 text-zinc-700 dark:text-zinc-400 text-xl ">
          <p>ごめんなさいね、ページがみつからなかったんですの。</p>
          <p>ホームにもどってくださいね。</p>
        </div>
        <div className="m-10 flex flex-col items-center justify-center">
          <Image
            src="/notFound.png"
            alt="not found"
            width={400}
            height={0}
            unoptimized
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}