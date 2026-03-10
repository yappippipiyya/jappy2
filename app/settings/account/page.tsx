import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { fetchUser } from "@/app/lib/services/user";

import Navbar from "@/app/ui/navber";
import Footer from "@/app/ui/footer";
import AccountForm from "@/app/ui/settings/accountForm";



export default async function Page() {
  const session = await auth();
  const email = session?.user?.email || "";
  const user = await fetchUser(null, email);

  if (!user) return redirect("/signup");

  return (
    <main className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <div className="grow max-w-2xl mx-auto w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/settings"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">arrow_back</span>
          </Link>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            アカウント設定
          </h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <AccountForm user={user}/>
        </div>
      </div>

      <Footer />
    </main>
  );
}