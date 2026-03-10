import { auth } from "@/auth";
import { redirect } from "next/navigation";

import Navbar from "@/app/ui/navber";
import AccountForm from "@/app/ui/settings/accountForm";
import { fetchUser } from "@/app/lib/services/user";


export default async function Page() {
  const session = await auth();
  const email = session?.user?.email || "";

  if (!session?.user?.email) {
    redirect("/login");
  }

  const userExists = await fetchUser(null, session.user.email);
  if (userExists) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="grow max-w-2xl mx-auto w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            アカウント登録
          </h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <AccountForm email={email}/>
        </div>
      </main>

    </main>
  );
}