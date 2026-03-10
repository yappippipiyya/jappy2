import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";

import { fetchBands } from "@/app/lib/services/band"
import { fetchUser } from "@/app/lib/services/user";

import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"
import BandForm from "@/app/ui/band/bandForm";


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const token = params.id;

  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  const bands = await fetchBands(user.id)
  const band = bands.find(b => b.token === token && b.creator_user_id === user.id)

  if (!band) return


  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navber />

      <div className="max-w-2xl mx-auto pb-20 pt-8 px-5">

        {/* ヘッダーセクション */}
        <div className="flex items-center gap-2 mb-4">
          <Link
            href={`/band/${band.token}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">arrow_back</span>
          </Link>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            バンドを編集
          </h1>
        </div>

        {/* バンド作成フォームセクション */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <BandForm band={band}/>
        </div>
      </div>
      <Footer />
    </main>
  );
}