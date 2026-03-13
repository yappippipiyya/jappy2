import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from 'next/image';

import { fetchUser } from "@/app/lib/services/user"


export const metadata = {
  title: 'Not Found'
}

export default async function Page() {
  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  return (
    <>
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

    </>
  );
}