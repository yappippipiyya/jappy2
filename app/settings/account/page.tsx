import { auth } from "@/auth";

import Navbar from "@/app/ui/navber";
import Footer from "@/app/ui/footer";
import { fetchUser } from "@/app/lib/services/user";
import AccountForm from "@/app/ui/settings/accountForm";

import Link from "next/link";


export default async function Page() {
  const session = await auth();
  const email = session?.user?.email || "";
  const user = await fetchUser(null, email);

  if (!user) return <p>ユーザーが見つかりません</p>;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="grow max-w-2xl mx-auto w-full p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/settings" className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-300">arrow_back</span>
          </Link>
          <h1 className="text-3xl font-bold">アカウント設定</h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <AccountForm user={user}/>
        </div>
      </main>

      <Footer />
    </main>
  );
}