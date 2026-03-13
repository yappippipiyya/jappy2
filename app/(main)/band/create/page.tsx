import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { fetchUser } from "@/app/lib/services/user";

import BandForm from "@/app/ui/band/bandForm";


export default async function CreateBandPage() {
  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  return (
    <div className="max-w-2xl mx-auto pb-20 pt-8 px-5">

      {/* ヘッダーセクション */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">arrow_back</span>
        </Link>
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          新しいバンドを作成
        </h1>
      </div>

      {/* バンド作成フォームセクション */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <BandForm band={null}/>
      </div>
    </div>
  );
}